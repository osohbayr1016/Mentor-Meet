"use client";

import { useState } from "react";
import FirstMentorSignup from "./_components/FirstMentorSignup";
import SecondMentorSignup from "./_components/SecondMentorSignup";
import ThirdMentorSignup from "./_components/ThirdMentorSignUp";
import axios from "axios";
import Link from "next/link";

const BACKEND_URL = "http://localhost:8000";

const SignupPage = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`http://localhost:8000/mentorSignup`, {
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      if (
        res.data &&
        typeof res.data === "object" &&
        "error" in res.data &&
        res.data.error
      ) {
        throw new Error((res.data as any).message || "Signup failed");
      }
      setStep(3);
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
          loading={loading}
          error={error}
        />
      )}
      {step === 3 && (
        <div className="flex flex-col items-center justify-center h-screen">
          <h2 className="text-2xl font-bold mb-4">Бүртгэл амжилттай!</h2>
          <p>Та амжилттай бүртгэгдлээ.</p>
          <Link href="/create-profile">
            <button>Profile үүсгэх</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default SignupPage;
