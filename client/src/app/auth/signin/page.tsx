"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import { useFirebaseAuth } from "../../../lib/firebase-auth";

export default function SignIn() {
  const { user } = useFirebaseAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to role selection instead of assuming mentor
    router.push("/role-selection");
  }, [router]);

  // No loading state needed for Firebase auth redirect

  const handleMockSignIn = () => {
    // Mock sign-in for development
    const selectedRole = localStorage.getItem("selectedRole");

    localStorage.setItem(
      "mockUser",
      JSON.stringify({
        email: "test@example.com",
        name: selectedRole === "student" ? "Test Student" : "Test Mentor",
        image: "https://via.placeholder.com/150",
        role: selectedRole || "mentor",
      })
    );

    // Redirect based on role
    if (selectedRole === "student") {
      router.push("/student-dashboard");
    } else {
      router.push("/mentor-calendar");
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

      {/* Main Sign In Modal */}
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

            {/* Sign In Content */}
            <div className="text-center mb-8">
              <h2 className="font-[600] text-[24px] text-white mb-4">
                Нэвтрэх
              </h2>
              <p className="text-white/80 text-sm">
                Google-аар нэвтэрч орж, уулзалт үүсгэх боломжтой
              </p>
            </div>

            {/* Google Sign In Button */}
            <button
              onClick={() => router.push("/role-selection")}
              className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-[40px] hover:bg-gray-100 transition-colors mb-4"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google-аар нэвтрэх
            </button>

            {/* Mock Sign In for Development */}
            <button
              onClick={handleMockSignIn}
              className="flex items-center gap-3 bg-blue-600 text-white px-6 py-3 rounded-[40px] hover:bg-blue-700 transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              Хөгжүүлэлтийн горимд нэвтрэх
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
