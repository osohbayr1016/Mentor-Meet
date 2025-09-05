"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFirebaseAuth } from "../../lib/firebase-auth";
import {
  convertFirebaseUser,
  storeFirebaseUser,
} from "../../lib/firebase-integration";
import GoogleOAuthButton from "../../components/GoogleOAuthButton";

const MentorLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetStep, setResetStep] = useState(1); // 1: email, 2: code, 3: new password
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [lastLoginAttempt, setLastLoginAttempt] = useState(0);

  const router = useRouter();
  const { user, signIn } = useFirebaseAuth();

  // Redirect when Firebase user is available
  useEffect(() => {
    if (user) {
      console.log("Firebase login successful, redirecting to dashboard...");
      router.push("/mentor-dashboard");
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Мэйл болон нууц үг оруулна уу");
      return;
    }

    // Prevent multiple requests
    if (loading) {
      console.log("Login already in progress, ignoring click");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Use Firebase Authentication
      const user = await signIn(email, password);

      if (user) {
        // Store Firebase user data in localStorage for compatibility
        const userData = convertFirebaseUser(user, "mentor");
        storeFirebaseUser(userData);

        // Store additional mentor data
        localStorage.setItem("mentorEmail", user.email || "");

        // Clear form
        setEmail("");
        setPassword("");

        // Dispatch custom event to notify other components about auth change
        window.dispatchEvent(new Event("authChange"));

        console.log("Firebase login successful");

        // Redirect will happen via useEffect when user state updates
      } else {
        setError("Нэвтрэхэд алдаа гарлаа");
      }
    } catch (error: any) {
      console.error("Firebase login error:", error);
      if (error.code === "auth/user-not-found") {
        setError("Имэйл хаяг бүртгэгдээгүй байна");
      } else if (error.code === "auth/wrong-password") {
        setError("Нууц үг буруу байна");
      } else if (error.code === "auth/invalid-email") {
        setError("Имэйл хаягийн формат буруу байна");
      } else {
        setError("Нэвтрэхэд алдаа гарлаа");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail) {
      setResetError("Мэйл хаягаа оруулна уу");
      return;
    }

    setResetLoading(true);
    setResetError("");

    try {
      // TODO: Implement forgot password API call
      // await axios.post("http://localhost:8000/findMail", {
      //   email: resetEmail,
      // });
      setResetStep(2);
    } catch (error: any) {
      setResetError(error.response?.data?.message || "Алдаа гарлаа");
    } finally {
      setResetLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!resetCode) {
      setResetError("Кодыг оруулна уу");
      return;
    }

    setResetLoading(true);
    setResetError("");

    try {
      // TODO: Implement code verification
      setResetStep(3);
    } catch (error: any) {
      setResetError(error.response?.data?.message || "Алдаа гарлаа");
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) {
      setResetError("Шинэ нууц үг оруулна уу");
      return;
    }

    setResetLoading(true);
    setResetError("");

    try {
      // TODO: Implement password reset API call
      // await axios.put("http://localhost:8000/mentorResetPassword", {
      //   email: resetEmail,
      //   code: resetCode,
      //   newPassword,
      // });

      // Reset form and close modal
      setShowForgotPassword(false);
      setResetStep(1);
      setResetEmail("");
      setResetCode("");
      setNewPassword("");
      setResetError("");
    } catch (error: any) {
      setResetError(error.response?.data?.message || "Алдаа гарлаа");
    } finally {
      setResetLoading(false);
    }
  };

  const closeForgotPassword = () => {
    setShowForgotPassword(false);
    setResetStep(1);
    setResetEmail("");
    setResetCode("");
    setNewPassword("");
    setResetError("");
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

        console.log("Firebase Google login successful");
        // Redirect will happen via useEffect when user state updates
      } else {
        setError("Google-р нэвтрэхэд алдаа гарлаа. Дахин оролдоно уу.");
      }
    } catch (error) {
      console.error("Google login error:", error);
      setError("Google-р нэвтрэхэд алдаа гарлаа");
    }
  };

  // Handle Google OAuth error
  const handleGoogleError = (error: string) => {
    setError(`Google OAuth алдаа: ${error}`);
  };

  return (
    <div className="relative w-full h-screen">
      {/* Background image */}
      <div className="absolute inset-0 bg-black/30 -z-10" />
      <Image
        src="https://images.unsplash.com/photo-1706074740295-d7a79c079562?q=80&w=2232&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="background image"
        fill
        className="absolute inset-0 -z-20 object-cover"
      />

      {/* Main Login Modal */}
      <div className="relative z-10 w-full h-full flex justify-center items-center">
        <div className="w-6/10 h-7/10 flex items-center justify-center">
          <div className="w-full h-full border-gray-400/50 border-1 backdrop-blur-md bg-black/20 flex flex-col items-center rounded-[20px]">
            {/* Header */}
            <div className="h-[140px] flex flex-col items-center justify-between pt-[40px]">
              <div className="flex gap-3 pb-[30px]">
                <Image
                  src="/image709.png"
                  alt="Mentor Meet Logo"
                  width={29}
                  height={24}
                />
                <p className="font-[700] text-[22px] text-white">Mentor Meet</p>
              </div>
              <p className="font-[600] text-[24px] text-white">
                Сайн байна уу, Ментор!
              </p>
            </div>

            {/* Login Form */}
            <div className="w-full h-full flex flex-col justify-center items-center">
              <form
                onSubmit={handleLogin}
                className="w-[300px] flex flex-col gap-[10px]"
              >
                {/* Email Field */}
                <div className="flex gap-1 flex-col">
                  <p className="font-[500] text-[14px] text-white">Email</p>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Мэйл хаягаа оруулна уу..."
                    className="border-1 border-white rounded-[40px] py-[8px] px-[20px] w-full text-white bg-transparent placeholder:text-white/70"
                    required
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                    title="Please enter a valid email address"
                    disabled={loading}
                  />
                </div>

                {/* Password Field */}
                <div className="flex gap-1 flex-col">
                  <p className="font-[500] text-[14px] text-white">Password</p>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Нууц үгээ оруулна уу..."
                    className="border-1 border-white rounded-[40px] py-[8px] px-[20px] w-full text-white bg-transparent placeholder:text-white/70"
                    required
                    minLength={1}
                    title="Please enter your password"
                    disabled={loading}
                  />
                </div>

                {/* Forgot Password Link */}
                <div className="flex ">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-white/80 hover:text-white text-[14px] underline"
                    disabled={loading}
                  >
                    Нууц үг мартсан
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="text-red-400 text-xs text-center">
                    {error}
                  </div>
                )}

                {/* Login Button */}
                <div className="flex w-full justify-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="border-1 border-white text-white rounded-[40px] py-[6px] px-[50px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Түр хүлээнэ үү..." : "Нэвтрэх"}
                  </button>
                </div>
              </form>

              {/* Divider */}
              <div className="flex items-center my-4">
                <div className="flex-1 border-t border-white/30"></div>
                <span className="px-4 text-white/60 text-sm">эсвэл</span>
                <div className="flex-1 border-t border-white/30"></div>
              </div>

              {/* Google OAuth Button */}
              <GoogleOAuthButton
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                text="Google-р нэвтрэх"
                disabled={loading}
                userType="mentor"
                className="w-full max-w-[300px]"
              />
            </div>

            {/* Registration Link */}
            <div className="pb-[60px] flex gap-2 w-full justify-center">
              <p className="font-[400] text-[16px] text-white">
                Бүртгэлгүй юу?
              </p>
              <Link
                href="/mentor-signup"
                className="font-[400] cursor-pointer text-[16px] text-blue-400 hover:text-blue-300"
              >
                Бүртгүүлэх
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-black/80 backdrop-blur-md rounded-[20px] p-8 w-[400px] border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white text-xl font-semibold">
                {resetStep === 1 && "Нууц үг сэргээх"}
                {resetStep === 2 && "Баталгаажуулах код"}
                {resetStep === 3 && "Шинэ нууц үг"}
              </h3>
              <button
                onClick={closeForgotPassword}
                className="text-white/70 hover:text-white text-xl"
              >
                ×
              </button>
            </div>

            {resetStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="text-white text-sm mb-2 block">
                    Мэйл хаяг
                  </label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Мэйл хаягаа оруулна уу..."
                    className="w-full border border-white/30 rounded-lg px-4 py-2 bg-transparent text-white placeholder:text-white/50"
                  />
                </div>
                {resetError && (
                  <p className="text-red-400 text-sm">{resetError}</p>
                )}
                <button
                  onClick={handleForgotPassword}
                  disabled={resetLoading || !resetEmail.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resetLoading ? "Илгээж байна..." : "Код илгээх"}
                </button>
              </div>
            )}

            {resetStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="text-white text-sm mb-2 block">
                    Баталгаажуулах код
                  </label>
                  <input
                    type="text"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    placeholder="4 оронтой кодыг оруулна уу..."
                    className="w-full border border-white/30 rounded-lg px-4 py-2 bg-transparent text-white placeholder:text-white/50"
                    maxLength={4}
                  />
                </div>
                {resetError && (
                  <p className="text-red-400 text-sm">{resetError}</p>
                )}
                <button
                  onClick={handleVerifyCode}
                  disabled={
                    resetLoading || !resetCode.trim() || resetCode.length !== 4
                  }
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resetLoading ? "Шалгаж байна..." : "Баталгаажуулах"}
                </button>
              </div>
            )}

            {resetStep === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="text-white text-sm mb-2 block">
                    Шинэ нууц үг
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Шинэ нууц үгээ оруулна уу..."
                    className="w-full border border-white/30 rounded-lg px-4 py-2 bg-transparent text-white placeholder:text-white/50"
                  />
                </div>
                {resetError && (
                  <p className="text-red-400 text-sm">{resetError}</p>
                )}
                <button
                  onClick={handleResetPassword}
                  disabled={
                    resetLoading ||
                    !newPassword.trim() ||
                    newPassword.length < 6
                  }
                  className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resetLoading ? "Хадгалж байна..." : "Нууц үг солих"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorLoginPage;
