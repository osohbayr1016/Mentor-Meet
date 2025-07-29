"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FirstMentorSignup from "./_components/FirstMentorSignup";
import SecondMentorSignup from "./_components/SecondMentorSignup";
import ThirdMentorSignup from "./_components/ThirdMentorSignUp";
import axios from "axios";
import Link from "next/link";
import { useAuth } from "../_Components/MentorUserProvider";

const BACKEND_URL = "http://localhost:8000";

type SignupResponse = {
  message: string;
  token: string;
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
  const [autoLoggingIn, setAutoLoggingIn] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Email
  const handleEmailSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`http://localhost:8000/mentorEmail`, {
        email: form.email,
      });
      if (
        res.data &&
        typeof res.data === "object" &&
        "error" in res.data &&
        res.data.error
      ) {
        throw new Error((res.data as any).message || "Email check failed");
      }
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
      const res = await axios.post(`http://localhost:8000/mentorOtp`, {
        email: form.email,
        code: form.otp,
      });
      if (
        res.data &&
        typeof res.data === "object" &&
        "error" in res.data &&
        res.data.error
      ) {
        throw new Error((res.data as any).message || "OTP check failed");
      }
      setStep(2);
    } catch (e: any) {
      setError(e.response?.data?.message || e.message || "OTP check failed");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Signup
  const handleSignupSubmit = async () => {
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
        `http://localhost:8000/mentorSignup`,
        {
          email: form.email,
          password: form.password,
        }
      );

      if (
        res.data &&
        typeof res.data === "object" &&
        "error" in res.data &&
        res.data.error
      ) {
        throw new Error((res.data as any).message || "Signup failed");
      }

      // Step 2: Use the token from signup response
      const { token, message } = res.data;

      if (token) {
        console.log("Signup successful, token received:", token);
        setAutoLoggingIn(true);

        try {
          // Fetch mentor profile data using the token
          const profileResponse = await axios.get<ProfileResponse>(
            "http://localhost:8000/mentorProfile",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const mentorData = profileResponse.data.mentor;

          if (mentorData) {
            // Store token and user data
            localStorage.setItem("mentorToken", token);
            localStorage.setItem("mentorUser", JSON.stringify(mentorData));

            console.log("Auto-login successful with profile data");
            setStep(3);

            // Auto redirect to home after 3 seconds
            setTimeout(() => {
              router.push("/");
            }, 3000);
          } else {
            // Fallback: create minimal user object
            const minimalUser = {
              mentorId: "", // Will be updated when profile is complete
              email: form.email,
              isAdmin: false,
              firstName: "",
              lastName: "",
            };

            localStorage.setItem("mentorToken", token);
            localStorage.setItem("mentorUser", JSON.stringify(minimalUser));

            console.log("Auto-login successful with minimal data");
            setStep(3);
            setTimeout(() => {
              router.push("/");
            }, 3000);
          }
        } catch (profileError: any) {
          console.error("Profile fetch failed:", profileError);

          // Still store token and minimal user data
          const minimalUser = {
            mentorId: "",
            email: form.email,
            isAdmin: false,
            firstName: "",
            lastName: "",
          };

          localStorage.setItem("mentorToken", token);
          localStorage.setItem("mentorUser", JSON.stringify(minimalUser));

          setStep(3);
          setTimeout(() => {
            router.push("/");
          }, 3000);
        } finally {
          setAutoLoggingIn(false);
        }
      } else {
        console.error("No token received from signup");
        setStep(3);
        setTimeout(() => {
          router.push("/mentor-login");
        }, 3000);
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
          loading={loading}
          error={error}
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
      {step === 3 && (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-900 to-purple-900">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-white">
              Бүртгэл амжилттай!
            </h2>
            <p className="pb-4 text-white/80">
              Та амжилттай бүртгэгдэж, нэвтэрлээ.
            </p>
            <p className="pb-6 text-white/60 text-sm">
              3 секундын дараа нүүр хуудас руу шилжих болно...
            </p>
            <Link href="/">
              <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full py-3 px-8 transition-colors duration-200">
                Нүүр хуудас руу орох
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupPage;
