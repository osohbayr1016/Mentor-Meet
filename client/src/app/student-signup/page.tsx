"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FirstStudentSignup from "./_components/FirstStudentSignup";
import SecondStudentSignup from "./_components/SecondStudentSignup";
import ThirdStudentSignup from "./_components/ThirdStudentSignUp";
import FourthStudentSignup from "./_components/FourthStudentSignup";
import axios from "axios";

const BACKEND_URL = "http://localhost:8000";

const StudentSignupPage = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(2);
  const router = useRouter();

  // Auto redirect after success
  useEffect(() => {
    if (step === 4) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push("/student-login");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [step, router]);

  // Step 1: Email
  const handleEmailSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`http://localhost:8000/Checkemail`, {
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
      const res = await axios.post(`http://localhost:8000/checkOtp`, {
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

  // Step 3: Password
  const handlePasswordSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`http://localhost:8000/createPassword`, {
        email: form.email,
        password: form.password,
      });
      if (
        res.data &&
        typeof res.data === "object" &&
        "error" in res.data &&
        res.data.error
      ) {
        throw new Error(
          (res.data as any).message || "Password creation failed"
        );
      }
      setStep(3);
    } catch (e: any) {
      setError(
        e.response?.data?.message || e.message || "Password creation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 4: Nickname and Phone Number
  const handleProfileSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`http://localhost:8000/StudentNameNumber`, {
        email: form.email,
        nickname: form.nickname,
        phoneNumber: form.phoneNumber,
      });
      if (
        res.data &&
        typeof res.data === "object" &&
        "error" in res.data &&
        res.data.error
      ) {
        throw new Error((res.data as any).message || "Profile creation failed");
      }
      setStep(4);
    } catch (e: any) {
      setError(
        e.response?.data?.message || e.message || "Profile creation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {step === 0 && (
        <FirstStudentSignup
          email={form.email}
          setEmail={(email) => setForm((f) => ({ ...f, email }))}
          onSubmit={handleEmailSubmit}
          loading={loading}
          error={error}
        />
      )}
      {step === 1 && (
        <SecondStudentSignup
          otp={form.otp}
          setOtp={(otp) => setForm((f) => ({ ...f, otp }))}
          onSubmit={handleOtpSubmit}
          loading={loading}
          error={error}
        />
      )}
      {step === 2 && (
        <ThirdStudentSignup
          password={form.password}
          confirmPassword={form.confirmPassword}
          setPassword={(password) => setForm((f) => ({ ...f, password }))}
          setConfirmPassword={(confirmPassword) =>
            setForm((f) => ({ ...f, confirmPassword }))
          }
          onSubmit={handlePasswordSubmit}
          loading={loading}
          error={error}
        />
      )}
      {step === 3 && (
        <FourthStudentSignup
          nickname={form.nickname}
          phoneNumber={form.phoneNumber}
          setNickname={(nickname) => setForm((f) => ({ ...f, nickname }))}
          setPhoneNumber={(phoneNumber) =>
            setForm((f) => ({ ...f, phoneNumber }))
          }
          onSubmit={handleProfileSubmit}
          loading={loading}
          error={error}
        />
      )}
      {step === 4 && (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-green-50 to-blue-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
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
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Бүртгэл амжилттай!
            </h2>
            <p className="text-gray-600 mb-6">Та амжилттай бүртгэгдлээ.</p>
            <div className="text-sm text-gray-500">
              <p>
                Та {countdown} секундын дараа нэвтрэх хуудас руу шилжих болно...
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${((2 - countdown) / 2) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentSignupPage;
