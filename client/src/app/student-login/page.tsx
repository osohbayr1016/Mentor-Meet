"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GoogleOAuthButton from "../../components/GoogleOAuthButton";
import { useFirebaseAuth } from "../../lib/firebase-auth";
import {
  convertFirebaseUser,
  storeFirebaseUser,
} from "../../lib/firebase-integration";

const StudentLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { user, signIn } = useFirebaseAuth();

  // Handle Google OAuth success
  const handleGoogleSuccess = async () => {
    try {
      // Firebase user should already be authenticated by GoogleOAuthButton
      if (user) {
        // Store Firebase user data in localStorage for compatibility
        const userData = convertFirebaseUser(user, "student");
        storeFirebaseUser(userData);

        // Store additional student data
        localStorage.setItem("studentEmail", user.email || "");

        // Dispatch custom event to notify other components about auth change
        window.dispatchEvent(new Event("authChange"));

        // Redirect to student dashboard
        router.push("/student-dashboard");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Имэйл хаягаа оруулна уу");
      return;
    }

    if (!password.trim()) {
      setError("Нууц үгийг оруулна уу");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Use Firebase Authentication
      const user = await signIn(email, password);

      if (user) {
        // Store Firebase user data in localStorage for compatibility
        const userData = convertFirebaseUser(user, "student");
        storeFirebaseUser(userData);

        // Store additional student data
        localStorage.setItem("studentEmail", user.email || "");

        // Dispatch custom event to notify other components about auth change
        window.dispatchEvent(new Event("authChange"));

        // Redirect to student dashboard
        router.push("/student-dashboard");
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
        <div className="w-6/10 h-8/10 flex items-center justify-center">
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

            {/* Login Form */}
            <div className="w-full max-w-md px-8">
              <div className="text-center mb-8">
                <h2 className="font-[600] text-[24px] text-white mb-4">
                  Суралцагч нэвтрэх
                </h2>
                <p className="text-white/80 text-sm">
                  Бүртгэлтэй имэйл болон нууц үгээ оруулна уу
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Имэйл хаяг"
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-[40px] text-white placeholder-white/50 focus:outline-none focus:border-white/50"
                  />
                </div>

                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Нууц үг"
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-[40px] text-white placeholder-white/50 focus:outline-none focus:border-white/50"
                  />
                </div>

                {error && (
                  <div className="text-red-400 text-sm text-center">
                    {typeof error === "string" ? error : "Алдаа гарлаа"}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-black px-6 py-3 rounded-[40px] hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  {loading ? "Нэвтэрч байна..." : "Нэвтрэх"}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center my-6">
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
                userType="student"
              />

              {/* Links */}
              <div className="mt-8 text-center space-y-4">
                <Link href="/student-signup">
                  <button className="px-6 py-3 text-white border border-white/30 rounded-[40px] hover:bg-white/10 transition-colors">
                    Бүртгэл үүсгэх
                  </button>
                </Link>

                <div>
                  <Link href="/role-selection">
                    <button className="text-white/70 hover:text-white text-sm transition-colors">
                      Буцах
                    </button>
                  </Link>
                </div>
              </div>
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

export default StudentLoginPage;
