"use client";

import { useState } from "react";
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
  const [autoLoggingIn, setAutoLoggingIn] = useState(false);
  const [error, setError] = useState("");
  const [googleUserData, setGoogleUserData] = useState<any>(null);
  const [isGoogleAuth, setIsGoogleAuth] = useState(false);

  // Handle Google OAuth success (similar to student signup)
  const handleGoogleSuccess = async (session: any) => {
    console.log("Google OAuth success called with session:", session);
    setIsGoogleAuth(true);
    setLoading(true);
    setError("");

    try {
      // Check if mentor already exists with this email
      const checkResponse = await axios.post(`${BACKEND_URL}/mentorEmail`, {
        email: session.user?.email,
      });

      // Type the response data properly
      const checkData = checkResponse.data as {
        error?: boolean;
        message?: string;
      };

      console.log("mentorEmail response:", checkData);

      if (checkData.error) {
        // Mentor doesn't exist, proceed with Google signup
        console.log("Email available, proceeding with Google signup");
        setGoogleUserData({
          email: session.user?.email,
          name: session.user?.name,
          image: session.user?.image,
          accessToken: session.accessToken,
        });
        setForm(prev => ({ ...prev, email: session.user?.email || "" }));
        setStep(3); // Skip to success step for Google users
      } else {
        // Mentor already exists, try to login with Google
        console.log("Mentor already exists, attempting Google login");
        try {
          const loginResponse = await axios.post(`${BACKEND_URL}/mentorLogin`, {
            email: session.user?.email,
            googleAuth: true,
          });

          console.log("Google login response:", loginResponse.data);

          if (loginResponse.data.token) {
            // Store the authentication data
            localStorage.setItem("mentorToken", loginResponse.data.token);
            localStorage.setItem("mentorEmail", session.user?.email || "");
            localStorage.setItem("mentorUser", JSON.stringify(loginResponse.data.mentor));

            console.log("Google login successful, redirecting to create-profile");
            router.push("/create-profile");
            return; // Exit early on successful login
          } else {
            setError("Google аккаунт олдсон боловч нэвтрэхэд алдаа гарлаа. Гарын авлагаар нэвтэрнэ үү.");
          }
        } catch (loginError: any) {
          console.error("Google login error:", loginError);
          setError("Google-р нэвтрэхэд алдаа гарлаа. Гарын авлагаар нэвтэрнэ үү.");
        }
      }
    } catch (error: any) {
      console.error("Google sign-up error:", error);
      setError(`Google-р бүртгүүлэхэд алдаа гарлаа: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google OAuth error
  const handleGoogleError = (error: string) => {
    console.error("Google OAuth error:", error);
    setError(typeof error === 'string' ? error : 'Google OAuth алдаа гарлаа');
    setLoading(false);
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

      // Type the response data properly
      const responseData = res.data as { error?: boolean; message?: string };
      if (
        responseData &&
        typeof responseData === "object" &&
        "error" in responseData &&
        responseData.error
      ) {
        throw new Error((responseData as any).message || "Email check failed");
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
      const res = await axios.post(`${BACKEND_URL}/mentorOtp`, {
        email: form.email,
        code: form.otp,
      });

      // Type the response data properly
      const responseData = res.data as { error?: boolean; message?: string };
      if (
        responseData &&
        typeof responseData === "object" &&
        "error" in responseData &&
        responseData.error
      ) {
        throw new Error((responseData as any).message || "OTP check failed");
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
    // If it's Google auth, handle Google signup
    if (isGoogleAuth && googleUserData) {
      setLoading(true);
      setError("");
      try {
        // Create mentor with Google data
        const res = await axios.post<SignupResponse>(
          `${BACKEND_URL}/mentorSignup`,
          {
            email: googleUserData.email,
            password: "", // No password for Google OAuth users
            googleAuth: true,
            googleData: {
              name: googleUserData.name,
              image: googleUserData.image,
              accessToken: googleUserData.accessToken,
            },
          }
        );

        if (res.data.token) {
          // Store token immediately after successful signup
          localStorage.setItem("mentorToken", res.data.token);

          // Auto-login successful
          const mentorData = {
            mentorId: res.data.mentorId,
            email: googleUserData.email,
            isAdmin: false,
            firstName: googleUserData.name?.split(" ")[0] || "",
            lastName: googleUserData.name?.split(" ").slice(1).join(" ") || "",
            image: googleUserData.image,
          };

          localStorage.setItem("mentorUser", JSON.stringify(mentorData));

          setStep(3); // Go to success step

          setTimeout(() => {
            router.push("/create-profile");
          }, 3000);
          return;
        }
      } catch (error: any) {
        console.error("Google signup error:", error);
        setError(
          error.response?.data?.message || "Google-р бүртгүүлэхэд алдаа гарлаа"
        );
      } finally {
        setLoading(false);
      }
      return;
    }

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
            setStep(3);

            // Auto redirect to profile creation after 3 seconds
            setTimeout(() => {
              router.push("/create-profile");
            }, 3000);
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
            setStep(3);
            setTimeout(() => {
              router.push("/create-profile");
            }, 3000);
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

          setStep(3);
          setTimeout(() => {
            router.push("/create-profile");
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
          onGoogleSuccess={handleGoogleSuccess}
          onGoogleError={handleGoogleError}
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
              {googleUserData
                ? "Google-р амжилттай бүртгэгдлээ. Одоо профайлаа үүсгэх шат руу орно уу."
                : "Та амжилттай бүртгэгдлээ. Одоо профайлаа үүсгэх шат руу орно уу."}
            </p>
            <p className="pb-6 text-white/60 text-sm">
              3 секундын дараа профайл үүсгэх хуудас руу шилжих болно...
            </p>
            <Link href="/create-profile">
              <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full py-3 px-8 transition-colors duration-200">
                Профайл үүсгэх
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupPage;
