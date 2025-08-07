"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FirstStudentSignup from "./_components/FirstStudentSignup";
import SecondStudentSignup from "./_components/SecondStudentSignup";
import ThirdStudentSignUp from "./_components/ThirdStudentSignUp";
import FourthStudentSignup from "./_components/FourthStudentSignup";

type SignupStep = "email" | "otp" | "password" | "profile";

const StudentSignupPage = () => {
  const router = useRouter();
  const [googleUserData, setGoogleUserData] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<SignupStep>("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form data
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Handle Google OAuth sign-in
  const handleGoogleSignIn = async (userData: any) => {
    setLoading(true);
    setError("");

    try {
      // Check if student already exists with this email
      const checkResponse = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/Checkemail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userData.email }),
        }
      );

      const checkData = await checkResponse.json();

      if (checkResponse.ok) {
        // Student doesn't exist, create new student with Google data
        const signupResponse = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
          }/StudentNameNumber`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: userData.email,
              nickname: userData.name?.split(" ")[0] || "Student",
              phoneNumber: "", // Will be filled in profile step
              googleAuth: true,
              googleData: {
                name: userData.name,
                image: userData.image,
                accessToken: userData.accessToken,
              },
            }),
          }
        );

        const signupData = await signupResponse.json();

        if (signupResponse.ok) {
          // Auto-login successful
          const studentData = {
            email: userData.email,
            nickname: userData.name?.split(" ")[0] || "Student",
            phoneNumber: "",
            image: userData.image,
          };

          localStorage.setItem("studentUser", JSON.stringify(studentData));

          setGoogleUserData(userData);
          setEmail(userData.email);
          setCurrentStep("profile"); // Skip to profile step
        } else {
          setError(signupData.message || "Google-р бүртгүүлэхэд алдаа гарлаа");
        }
      } else {
        // Student already exists, try to login
        setError("Энэ имэйл хаягтай хэрэглэгч аль хэдийн бүртгэгдсэн байна.");
      }
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      setError("Google-р бүртгүүлэхэд алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async () => {
    if (!email.trim()) {
      setError("Имэйл хаягаа оруулна уу");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/Checkemail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setCurrentStep("otp");
        setError("");
      } else {
        setError(data.message || "Имэйл илгээхэд алдаа гарлаа");
      }
    } catch (error) {
      setError("Сүлжээний алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (!otp.trim()) {
      setError("OTP кодыг оруулна уу");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/checkOtp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, code: otp }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setCurrentStep("password");
        setError("");
      } else {
        setError(data.message || "OTP код буруу байна");
      }
    } catch (error) {
      setError("Сүлжээний алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!password.trim()) {
      setError("Нууц үгийг оруулна уу");
      return;
    }

    if (password !== confirmPassword) {
      setError("Нууц үгнүүд таарахгүй байна");
      return;
    }

    if (password.length < 6) {
      setError("Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/createPassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setCurrentStep("profile");
        setError("");
      } else {
        setError(data.message || "Нууц үг үүсгэхэд алдаа гарлаа");
      }
    } catch (error) {
      setError("Сүлжээний алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async () => {
    if (!nickname.trim()) {
      setError("Хоч нэрийг оруулна уу");
      return;
    }

    if (!phoneNumber.trim()) {
      setError("Утасны дугаарыг оруулна уу");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/StudentNameNumber`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, nickname, phoneNumber }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Store student data
        const studentData = {
          email,
          nickname,
          phoneNumber,
        };

        localStorage.setItem("studentUser", JSON.stringify(studentData));
        localStorage.setItem("studentEmail", email);

        // Redirect to student dashboard
        router.push("/student-dashboard");
      } else {
        setError(data.message || "Профайл үүсгэхэд алдаа гарлаа");
      }
    } catch (error) {
      setError("Сүлжээний алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case "email":
        return (
          <div className="space-y-6">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Имэйл хаяг"
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-[40px] text-white placeholder-white/50 focus:outline-none focus:border-white/50"
              />
            </div>
            <button
              type="button"
              onClick={handleEmailSubmit}
              disabled={loading}
              className="w-full bg-white text-black rounded-[40px] py-3 font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {loading ? "Илгээж байна..." : "Үргэлжлүүлэх"}
            </button>
          </div>
        );

      case "otp":
        return (
          <div className="space-y-6">
            <div>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="OTP код"
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-[40px] text-white placeholder-white/50 focus:outline-none focus:border-white/50"
              />
            </div>
            <button
              type="button"
              onClick={handleOtpSubmit}
              disabled={loading}
              className="w-full bg-white text-black rounded-[40px] py-3 font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {loading ? "Шалгаж байна..." : "Баталгаажуулах"}
            </button>
          </div>
        );

      case "password":
        return (
          <div className="space-y-6">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Нууц үг"
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-[40px] text-white placeholder-white/50 focus:outline-none focus:border-white/50"
              />
            </div>
            <div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Нууц үг давтах"
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-[40px] text-white placeholder-white/50 focus:outline-none focus:border-white/50"
              />
            </div>
            <button
              type="button"
              onClick={handlePasswordSubmit}
              disabled={loading}
              className="w-full bg-white text-black rounded-[40px] py-3 font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {loading ? "Үүсгэж байна..." : "Үргэлжлүүлэх"}
            </button>
          </div>
        );

      case "profile":
        return (
          <div className="space-y-6">
            <div>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Хоч нэр"
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-[40px] text-white placeholder-white/50 focus:outline-none focus:border-white/50"
              />
            </div>
            <div>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Утасны дугаар"
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-[40px] text-white placeholder-white/50 focus:outline-none focus:border-white/50"
              />
            </div>
            <button
              type="button"
              onClick={handleProfileSubmit}
              disabled={loading}
              className="w-full bg-white text-black rounded-[40px] py-3 font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {loading ? "Үүсгэж байна..." : "Бүртгүүлэх"}
            </button>
          </div>
        );

      default:
        return null;
    }
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

      {/* Main Signup Modal */}
      <div className="relative z-10 w-full h-full flex justify-center items-center">
        <div className="w-6/10 h-7/10 flex items-center justify-center">
          <div className="w-full h-full border-gray-400/50 border-1 backdrop-blur-md bg-black/20 flex flex-col items-center justify-center rounded-[20px]">
            {/* Header */}
            <div className="flex gap-3 mb-8">
              <Image
                src="/image709.png"
                alt="Mentor Meet Logo"
                width={29}
                height={24}
              />
              <p className="font-[700] text-[22px] text-white">Mentor Meet</p>
            </div>

            {/* Signup Form */}
            <div className="w-full max-w-md px-8">
              <div className="text-center mb-8">
                <h2 className="font-[600] text-[24px] text-white mb-4">
                  Суралцагч бүртгүүлэх
                </h2>
                <p className="text-white/80 text-sm">
                  {currentStep === "email" && "Имэйл хаягаа оруулна уу"}
                  {currentStep === "otp" &&
                    "Имэйлд илгээсэн OTP кодыг оруулна уу"}
                  {currentStep === "password" && "Нууц үгээ тохируулна уу"}
                  {currentStep === "profile" && "Профайл мэдээллээ оруулна уу"}
                </p>
              </div>

              {error && (
                <div className="text-red-400 text-sm text-center mb-4">
                  {error}
                </div>
              )}

              {renderStep()}

              {/* Back button */}
              {currentStep !== "email" && (
                <button
                  type="button"
                  onClick={() => {
                    if (currentStep === "otp") setCurrentStep("email");
                    if (currentStep === "password") setCurrentStep("otp");
                    if (currentStep === "profile") setCurrentStep("password");
                    setError("");
                  }}
                  className="w-full mt-4 text-white/70 hover:text-white transition-colors"
                >
                  ← Буцах
                </button>
              )}

              {/* Login link */}
              <div className="text-center mt-6">
                <p className="text-white/70 text-sm">
                  Бүртгэлтэй юу?{" "}
                  <Link
                    href="/student-login"
                    className="text-white hover:underline"
                  >
                    Нэвтрэх
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-2 left-6 text-xs text-white/60 z-30">
        <div>Copyright © 2025 Mentor Meet</div>
        <div>All rights reserved.</div>
      </div>
    </div>
  );
};

export default StudentSignupPage;
