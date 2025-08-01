"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const StudentLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

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
      const response = await fetch(
        "https://mentor-meet-o3rp.onrender.com/studentLogin",
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
        // Store student data and redirect
        localStorage.setItem("studentToken", data.token);
        localStorage.setItem("studentUser", JSON.stringify(data.user));

        // Redirect to student dashboard
        router.push("/student-dashboard");
      } else {
        setError(data.message || "Нэвтрэхэд алдаа гарлаа");
      }
    } catch (error) {
      setError("Сүлжээний алдаа гарлаа");
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
                    {error}
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
