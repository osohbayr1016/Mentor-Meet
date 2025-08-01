"use client";

import { useState } from "react";
import axios from "axios";

import FirstStudentForgotPassword from "./_components/FirstStudentForgotPassword";
import SecondStudentForgotPassword from "./_components/SecondStudentForgotPassword";
import ThirdStudentForgotPassword from "./_components/ThirdStudentForgotPassword";

const BACKEND_URL = "https://mentor-meet-ferb.onrender.com";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Email
  const handleEmailSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        `https://mentor-meet-ferb.onrender.com/findStuMail`,
        {
          email: form.email,
        }
      );
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
      const res = await axios.post(
        `https://mentor-meet-ferb.onrender.com/findOtp`,
        {
          email: form.email,
          code: form.otp,
        }
      );
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
  const handleResetPasswordSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.put(
        `https://mentor-meet-ferb.onrender.com/studentResetPassword`,
        {
          email: form.email,
          password: form.newPassword,
          //  confirmPassword: form.confirmPassword,
        }
      );
      if (
        res.data &&
        typeof res.data === "object" &&
        "error" in res.data &&
        res.data.error
      ) {
        throw new Error((res.data as any).message || "Password reset failed");
      }
      setStep(3);
    } catch (e: any) {
      setError(
        e.response?.data?.message || e.message || "Password reset failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {step === 0 && (
        <FirstStudentForgotPassword
          email={form.email}
          setEmail={(email) => setForm((f) => ({ ...f, email }))}
          onSubmit={handleEmailSubmit}
          loading={loading}
          error={error}
        />
      )}
      {step === 1 && (
        <SecondStudentForgotPassword
          otp={form.otp}
          setOtp={(otp) => setForm((f) => ({ ...f, otp }))}
          onSubmit={handleOtpSubmit}
          loading={loading}
          error={error}
        />
      )}
      {step === 2 && (
        <ThirdStudentForgotPassword
          password={form.newPassword}
          confirmPassword={form.confirmPassword}
          setPassword={(newPassword) => setForm((f) => ({ ...f, newPassword }))}
          setConfirmPassword={(confirmPassword) =>
            setForm((f) => ({ ...f, confirmPassword }))
          }
          onSubmit={handleResetPasswordSubmit}
          loading={loading}
          error={error}
        />
      )}
      {step === 3 && (
        <div className="flex flex-col items-center justify-center h-screen">
          <h2 className="text-2xl font-bold mb-4">
            Нууц үг амжилттай солигдлоо!
          </h2>
          <p>Нэвтрэх дарж, шинэ нууц үгээрээ нэвтрэнэ үү.</p>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordPage;
