"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FirstMentorSignup from "./_components/FirstMentorSignup";
import SecondMentorSignup from "./_components/SecondMentorSignup";
import ThirdMentorSignup from "./_components/ThirdMentorSignUp";
import axios from "axios";
import Link from "next/link";
import { useFirebaseAuth } from "../../lib/firebase-auth";
import {
  convertFirebaseUser,
  storeFirebaseUser,
} from "../../lib/firebase-integration";
import GoogleOAuthButton from "../../components/GoogleOAuthButton";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type SignupResponse = {
  message: string;
  token: string;
  mentorId: string;
};

type ProfileResponse = {
  mentor: {
    mentorId: string;
    email: string;
    isAdmin: boolean;
    firstName: string;
    lastName: string;
    nickName?: string;
    category?: string;
    careerDuration?: string;
    profession?: string;
    image?: string;
  };
};

const SignupPage = () => {
  const router = useRouter();
  const { user, signUp } = useFirebaseAuth();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [autoLoggingIn, setAutoLoggingIn] = useState(false);
  const [error, setError] = useState("");
  const [googleUserData, setGoogleUserData] = useState<any>(null);
  const [isGoogleAuth, setIsGoogleAuth] = useState(false);

  // If a mentor token already exists (e.g., Google OAuth completed), redirect
  useEffect(() => {
    try {
      const token =
        typeof window !== "undefined" && localStorage.getItem("mentorToken");
      if (token) {
        router.replace("/create-profile");
      }
    } catch {}
  }, [router]);

  // Handle Google signup specifically
  const handleGoogleSignup = async (session: any) => {
    console.log("Creating mentor account with Google data...");

    // Create mentor with Google data
    const res = await axios.post<SignupResponse>(
      `${BACKEND_URL}/mentorSignup`,
      {
        email: session.user?.email,
        password: "", // No password for Google OAuth users
        googleAuth: true,
        googleData: {
          name: session.user?.name,
          image: session.user?.image,
          accessToken: session.accessToken,
        },
      }
    );

    if (res.data.token) {
      // Store token immediately after successful signup
      localStorage.setItem("mentorToken", res.data.token);

      // Create mentor data for local storage
      const mentorData = {
        mentorId: res.data.mentorId,
        email: session.user?.email,
        isAdmin: false,
        firstName: session.user?.name?.split(" ")[0] || "",
        lastName: session.user?.name?.split(" ").slice(1).join(" ") || "",
        image: session.user?.image,
      };

      localStorage.setItem("mentorUser", JSON.stringify(mentorData));
      localStorage.setItem("mentorEmail", session.user?.email || "");

      console.log("Google signup successful, redirecting to create-profile");
      router.push("/create-profile");
    } else {
      throw new Error("Signup successful but no token received");
    }
  };

  // Step 1: Email
  const handleEmailSubmit = async () => {
    // Prevent OTP flow if Google Auth is being used
    if (isGoogleAuth) {
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${BACKEND_URL}/mentorEmail`, {
        email: form.email,
      });

      // Server returns 200 in all cases with flags. Treat userExists as duplicate; otherwise proceed to OTP.
      const responseData = res.data as {
        error?: boolean;
        message?: string;
        userExists?: boolean;
      };

      if (responseData?.userExists) {
        throw new Error(responseData.message || "Email already registered");
      }

      // When email is available, server sends OTP and (confusingly) sets error=true.
      // We ignore the error flag here and advance to OTP.
      setStep(1);
    } catch (e: any) {
      setError(e.response?.data?.message || e.message || "Email check failed");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: OTP
  const handleOtpSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${BACKEND_URL}/mentorOtp`, {
        email: form.email,
        code: form.otp,
      });

      // Treat 200 as success and advance to password step, mirroring student flow
      const responseData = res.data as { message?: string };
      if (!responseData) {
        throw new Error("OTP check failed");
      }
      setStep(2);
    } catch (e: any) {
      setError(e.response?.data?.message || e.message || "OTP check failed");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Signup (for regular password-based signup only)
  const handleSignupSubmit = async () => {
    // Regular password-based signup
    // Password validation
    if (form.password !== form.confirmPassword) {
      setError("Password not matching");
      return;
    }

    // Additional password validation
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setError("");
    try {
      // Use Firebase Authentication to create account
      const firebaseUser = await signUp(form.email, form.password);

      if (firebaseUser) {
        console.log("Firebase signup successful");

        // Store Firebase user data in localStorage for compatibility
        const userData = convertFirebaseUser(firebaseUser, "mentor");
        storeFirebaseUser(userData);

        // Store additional mentor data
        localStorage.setItem("mentorEmail", form.email);

        // Dispatch custom event to notify other components about auth change
        window.dispatchEvent(new Event("authChange"));

        // Redirect to mentor dashboard after successful signup
        router.push("/mentor-dashboard");
      } else {
        setError("Signup failed");
      }
    } catch (error: any) {
      console.error("Firebase signup error:", error);
      if (error.code === "auth/email-already-in-use") {
        setError("Email already exists");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email format");
      } else if (error.code === "auth/weak-password") {
        setError("Password is too weak");
      } else {
        setError(error.message || "Signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Google OAuth success
  const handleGoogleSuccess = async () => {
    try {
      // Firebase user should already be authenticated by GoogleOAuthButton
      if (user) {
        // Store Firebase user data in localStorage for compatibility
        const userData = convertFirebaseUser(user, "mentor");
        storeFirebaseUser(userData);

        // Store additional mentor data
        localStorage.setItem("mentorEmail", user.email || "");

        // Dispatch custom event to notify other components about auth change
        window.dispatchEvent(new Event("authChange"));

        console.log("Firebase Google signup successful");
        // Redirect to create profile for Google users
        router.push("/create-profile");
      } else {
        setError("Google-р бүртгүүлэхэд алдаа гарлаа. Дахин оролдоно уу.");
      }
    } catch (error) {
      console.error("Google signup error:", error);
      setError("Google-р бүртгүүлэхэд алдаа гарлаа");
    }
  };

  // Handle Google OAuth error
  const handleGoogleError = (error: string) => {
    setError(`Google OAuth алдаа: ${error}`);
  };

  return (
    <div>
      {step === 0 && (
        <FirstMentorSignup
          email={form.email}
          setEmail={(email) => setForm((f) => ({ ...f, email }))}
          onSubmit={handleEmailSubmit}
          loading={googleLoading}
          error={error}
          onGoogleSuccess={handleGoogleSuccess}
          onGoogleError={handleGoogleError}
          callbackUrl="/create-profile"
        />
      )}
      {step === 1 && (
        <SecondMentorSignup
          otp={form.otp}
          setOtp={(otp) => setForm((f) => ({ ...f, otp }))}
          onSubmit={handleOtpSubmit}
          loading={loading}
          error={error}
        />
      )}
      {step === 2 && (
        <ThirdMentorSignup
          password={form.password}
          confirmPassword={form.confirmPassword}
          setPassword={(password) => setForm((f) => ({ ...f, password }))}
          setConfirmPassword={(confirmPassword) =>
            setForm((f) => ({ ...f, confirmPassword }))
          }
          onSubmit={handleSignupSubmit}
          loading={loading || autoLoggingIn}
          error={error}
          autoLoggingIn={autoLoggingIn}
        />
      )}
    </div>
  );
};

export default SignupPage;
