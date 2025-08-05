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
  const [currentStep, setCurrentStep] = useState<SignupStep>("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [googleUserData, setGoogleUserData] = useState<any>(null);

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
      const checkResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Checkemail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userData.email }),
      });

      const checkData = await checkResponse.json();

      if (checkResponse.ok) {
        // Student doesn't exist, create new student with Google data
        const signupResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/StudentNameNumber`,
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
        "https://mentor-meet-o3rp.onrender.com/Checkemail",
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
        "https://mentor-meet-o3rp.onrender.com/checkOtp",
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
        "https://mentor-meet-o3rp.onrender.com/createPassword",
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
        "https://mentor-meet-o3rp.onrender.com/StudentNameNumber",
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
          <FirstStudentSignup
            email={email}
            setEmail={setEmail}
            onSubmit={handleEmailSubmit}
            loading={loading}
            error={error}
            onGoogleSignIn={handleGoogleSignIn}
          />
        );

      case "otp":
        return (
          <SecondStudentSignup
            otp={otp}
            setOtp={setOtp}
            onSubmit={handleOtpSubmit}
            loading={loading}
            error={error}
          />
        );

      case "password":
        return (
          <ThirdStudentSignUp
            password={password}
            confirmPassword={confirmPassword}
            setPassword={setPassword}
            setConfirmPassword={setConfirmPassword}
            onSubmit={handlePasswordSubmit}
            loading={loading}
            error={error}
          />
        );

      case "profile":
        return (
          <FourthStudentSignup
            nickname={nickname}
            phoneNumber={phoneNumber}
            setNickname={setNickname}
            setPhoneNumber={setPhoneNumber}
            onSubmit={handleProfileSubmit}
            loading={loading}
            error={error}
            googleUserData={googleUserData}
          />
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
