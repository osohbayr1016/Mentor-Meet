"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

type SignupStep = "email" | "otp" | "password" | "profile";

const StudentSignupPage = () => {
  const [currentStep, setCurrentStep] = useState<SignupStep>("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Form data
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleEmailSubmit = async () => {
    if (!email.trim()) {
      setError("Имэйл хаягаа оруулна уу");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://https://mentor-meet-o3rp.onrender.com/Checkemail",
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
        "http://https://mentor-meet-o3rp.onrender.com/checkOtp",
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
        "http://https://mentor-meet-o3rp.onrender.com/createPassword",
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
        "http://https://mentor-meet-o3rp.onrender.com/StudentNameNumber",
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
        // Store student data and redirect
        localStorage.setItem("studentUser", JSON.stringify(data.user));
        router.push("/student-dashboard");
      } else {
        setError(data.message || "Профайл хадгалахад алдаа гарлаа");
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
          <div className="text-center">
            <h2 className="font-[600] text-[24px] text-white mb-4">
              Имэйл хаягаа оруулна уу
            </h2>
            <p className="text-white/80 text-sm mb-8">
              Бүртгэл үүсгэхийн тулд имэйл хаягаа оруулна уу
            </p>
            <div className="mb-6">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Имэйл хаяг"
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-[40px] text-white placeholder-white/50 focus:outline-none focus:border-white/50"
              />
            </div>
            {error && <div className="text-red-400 text-sm mb-4">{error}</div>}
            <button
              onClick={handleEmailSubmit}
              disabled={loading}
              className="w-full bg-white text-black px-6 py-3 rounded-[40px] hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {loading ? "Илгээж байна..." : "Үргэлжлүүлэх"}
            </button>
          </div>
        );

      case "otp":
        return (
          <div className="text-center">
            <h2 className="font-[600] text-[24px] text-white mb-4">
              OTP код оруулна уу
            </h2>
            <p className="text-white/80 text-sm mb-8">
              {email} хаяг руу илгээсэн кодыг оруулна уу
            </p>
            <div className="mb-6">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="OTP код"
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-[40px] text-white placeholder-white/50 focus:outline-none focus:border-white/50"
              />
            </div>
            {error && <div className="text-red-400 text-sm mb-4">{error}</div>}
            <button
              onClick={handleOtpSubmit}
              disabled={loading}
              className="w-full bg-white text-black px-6 py-3 rounded-[40px] hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {loading ? "Шалгаж байна..." : "Баталгаажуулах"}
            </button>
          </div>
        );

      case "password":
        return (
          <div className="text-center">
            <h2 className="font-[600] text-[24px] text-white mb-4">
              Нууц үг үүсгэнэ үү
            </h2>
            <p className="text-white/80 text-sm mb-8">
              Хамгийн багадаа 6 тэмдэгт байх ёстой
            </p>
            <div className="space-y-4 mb-6">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Нууц үг"
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-[40px] text-white placeholder-white/50 focus:outline-none focus:border-white/50"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Нууц үг давтах"
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-[40px] text-white placeholder-white/50 focus:outline-none focus:border-white/50"
              />
            </div>
            {error && <div className="text-red-400 text-sm mb-4">{error}</div>}
            <button
              onClick={handlePasswordSubmit}
              disabled={loading}
              className="w-full bg-white text-black px-6 py-3 rounded-[40px] hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {loading ? "Үүсгэж байна..." : "Үргэлжлүүлэх"}
            </button>
          </div>
        );

      case "profile":
        return (
          <div className="text-center">
            <h2 className="font-[600] text-[24px] text-white mb-4">
              Профайл мэдээлэл
            </h2>
            <p className="text-white/80 text-sm mb-8">
              Өөрийн мэдээллээ оруулна уу
            </p>
            <div className="space-y-4 mb-6">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Хоч нэр"
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-[40px] text-white placeholder-white/50 focus:outline-none focus:border-white/50"
              />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Утасны дугаар"
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-[40px] text-white placeholder-white/50 focus:outline-none focus:border-white/50"
              />
            </div>
            {error && <div className="text-red-400 text-sm mb-4">{error}</div>}
            <button
              onClick={handleProfileSubmit}
              disabled={loading}
              className="w-full bg-white text-black px-6 py-3 rounded-[40px] hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {loading ? "Хадгалж байна..." : "Бүртгэл дуусгах"}
            </button>
          </div>
        );
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

            {/* Step Progress */}
            <div className="flex gap-2 mb-8">
              <div
                className={`h-1 w-8 rounded-full ${
                  currentStep === "email" ? "bg-white" : "bg-gray-500"
                }`}
              ></div>
              <div
                className={`h-1 w-8 rounded-full ${
                  currentStep === "otp" ? "bg-white" : "bg-gray-500"
                }`}
              ></div>
              <div
                className={`h-1 w-8 rounded-full ${
                  currentStep === "password" ? "bg-white" : "bg-gray-500"
                }`}
              ></div>
              <div
                className={`h-1 w-8 rounded-full ${
                  currentStep === "profile" ? "bg-white" : "bg-gray-500"
                }`}
              ></div>
            </div>

            {/* Content */}
            <div className="w-full max-w-md px-8">{renderStep()}</div>

            {/* Back to Login */}
            <div className="mt-8">
              <Link href="/student-login">
                <button className="px-6 py-3 text-white border border-white/30 rounded-[40px] hover:bg-white/10 transition-colors">
                  Байгаа хэрэглэгч? Нэвтрэх
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Footer */}
      <div className="fixed bottom-2 left-6 text-xs text-white/60 z-30">
        <div>Copyright © 2025 Mentor Meet</div>
        <div>All rights reserved.</div>
      </div>
    </div>
  );
};

export default StudentSignupPage;
