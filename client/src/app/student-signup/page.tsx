"use client";

import { useState } from "react";
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
        <div className="flex flex-col items-center justify-center h-screen">
          <h2 className="text-2xl font-bold mb-4">Бүртгэл амжилттай!</h2>
          <p>Та амжилттай бүртгэгдлээ.</p>
        </div>
      )}
    </div>
  );
};

export default StudentSignupPage;
