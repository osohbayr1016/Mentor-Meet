"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FirstMentorSignup from "./_components/FirstMentorSignup";
import SecondMentorSignup from "./_components/SecondMentorSignup";
import ThirdMentorSignup from "./_components/ThirdMentorSignUp";
import axios from "axios";
import Link from "next/link";
import { useAuth } from "../_components/MentorUserProvider";

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
  const { login } = useAuth(); // Get login function from AuthProvider
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

  // Handle Google OAuth success
  const handleGoogleSuccess = async (session: any) => {
    console.log("Google OAuth success called with session:", session);
    setIsGoogleAuth(true);
    setGoogleLoading(true);
    setError("");

    try {
      // Check if mentor already exists with this email
      const checkResponse = await axios.post(`${BACKEND_URL}/mentorEmail`, {
        email: session.user?.email,
        googleAuth: true, // Indicate this is a Google OAuth check
      });

      const checkData = checkResponse.data as {
        error?: boolean;
        message?: string;
        userExists?: boolean;
        canLoginWithGoogle?: boolean;
      };

      console.log("mentorEmail response:", checkData);

      if (checkData.userExists) {
        // Mentor already exists, try to login with Google
        console.log("Mentor already exists, attempting Google login");

        const loginResponse = await axios.post(`${BACKEND_URL}/mentorLogin`, {
          email: session.user?.email,
          googleAuth: true,
        });

        console.log("Google login response:", loginResponse.data);

        if (loginResponse.data.token) {
          // Store the authentication data
          localStorage.setItem("mentorToken", loginResponse.data.token);
          localStorage.setItem("mentorEmail", session.user?.email || "");
          localStorage.setItem(
            "mentorUser",
            JSON.stringify(loginResponse.data.mentor)
          );

          console.log("Google login successful, redirecting to create-profile");
          router.replace("/create-profile");
          return;
        } else {
          throw new Error("Login successful but no token received");
        }
      } else {
        // Mentor doesn't exist, proceed with Google signup
        console.log("Email available, proceeding with Google signup");
        await handleGoogleSignup(session);
      }
    } catch (error: any) {
      console.error("Google authentication error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Google authentication failed";
      setError(`Google бүртгэл/нэвтрэх алдаа: ${errorMessage}`);
    } finally {
      setGoogleLoading(false);

      // If token is now present (login/signup succeeded), stop rendering this flow
      try {
        const token =
          typeof window !== "undefined" && localStorage.getItem("mentorToken");
        if (token) {
          router.replace("/create-profile");
        }
      } catch {}
    }
  };

  // Handle Google OAuth error
  const handleGoogleError = (error: string) => {
    console.error("Google OAuth error:", error);
    setError(typeof error === "string" ? error : "Google OAuth алдаа гарлаа");
    setGoogleLoading(false);
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
      // Step 1: Complete signup
      const res = await axios.post<SignupResponse>(
        `${BACKEND_URL}/mentorSignup`,
        {
          email: form.email,
          password: form.password,
        }
      );

      // Type the response data properly
      const responseData = res.data as SignupResponse & {
        error?: boolean;
        message?: string;
      };

      if (
        responseData &&
        typeof responseData === "object" &&
        "error" in responseData &&
        responseData.error
      ) {
        throw new Error((responseData as any).message || "Signup failed");
      }

      // Step 2: Use the token and mentorId from signup response
      const { token, message, mentorId } = responseData;

      if (token) {
        console.log("Signup successful, token received:", token);
        setAutoLoggingIn(true);

        // Store token immediately after successful signup
        localStorage.setItem("mentorToken", token);

        try {
          // Fetch mentor profile data using the token
          const profileResponse = await axios.get<ProfileResponse>(
            `${BACKEND_URL}/mentorProfile`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const mentorData = profileResponse.data.mentor;

          if (mentorData) {
            // Store user data
            localStorage.setItem("mentorUser", JSON.stringify(mentorData));

            console.log("Auto-login successful with profile data");
            // Directly redirect to create-profile
            router.push("/create-profile");
          } else {
            // Fallback: create minimal user object
            const minimalUser = {
              mentorId: mentorId || "", // Use the mentorId from signup response
              email: form.email,
              isAdmin: false,
              firstName: "",
              lastName: "",
            };

            localStorage.setItem("mentorUser", JSON.stringify(minimalUser));

            console.log("Auto-login successful with minimal data");
            // Directly redirect to create-profile
            router.push("/create-profile");
          }
        } catch (profileError: any) {
          console.error("Profile fetch failed:", profileError);

          // Still store minimal user data
          const minimalUser = {
            mentorId: mentorId || "",
            email: form.email,
            isAdmin: false,
            firstName: "",
            lastName: "",
          };

          localStorage.setItem("mentorUser", JSON.stringify(minimalUser));

          // Directly redirect to create-profile
          router.push("/create-profile");
        } finally {
          setAutoLoggingIn(false);
        }
      } else {
        console.error("No token received from signup");
        // Redirect to login if no token
        router.push("/mentor-login");
      }
    } catch (e: any) {
      setError(e.response?.data?.message || e.message || "Signup failed");
    } finally {
      setLoading(false);
    }
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
