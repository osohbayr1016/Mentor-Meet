"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return "OAuth тохиргооны алдаа. Системийн администратортай холбогдоно уу.";
      case "AccessDenied":
        return "Нэвтрэх эрх хүссэн боловч татгалзлаа.";
      case "Verification":
        return "Баталгаажуулалтын алдаа. Дахин оролдоно уу.";
      case "OAuthSignin":
        return "OAuth нэвтрэлтийн алдаа.";
      case "OAuthCallback":
        return "OAuth буцаах алдаа.";
      case "OAuthCreateAccount":
        return "OAuth бүртгэл үүсгэх алдаа.";
      case "EmailCreateAccount":
        return "Имэйл бүртгэл үүсгэх алдаа.";
      case "Callback":
        return "Буцаах URL-ийн алдаа.";
      case "OAuthAccountNotLinked":
        return "OAuth бүртгэл холбогдоогүй байна. Өөр арга ашиглан нэвтэрч орсон бол тэр арга ашиглана уу.";
      case "EmailSignin":
        return "Имэйл илгээхэд алдаа гарлаа.";
      case "CredentialsSignin":
        return "Нэвтрэх мэдээлэл буруу байна.";
      case "SessionRequired":
        return "Энэ хуудас үзэхийн тулд нэвтрэх шаардлагатай.";
      default:
        return "Нэвтрэхэд алдаа гарлаа. Дахин оролдоно уу.";
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

      {/* Error Modal */}
      <div className="relative z-10 w-full h-full flex justify-center items-center">
        <div className="w-6/10 max-w-md flex items-center justify-center">
          <div className="w-full border-gray-400/50 border-1 backdrop-blur-md bg-black/20 flex flex-col items-center justify-center rounded-[20px] p-8">
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

            {/* Error Content */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              
              <h2 className="font-[600] text-[24px] text-white mb-4">
                Нэвтрэлтийн алдаа
              </h2>
              
              <p className="text-white/80 text-sm mb-4">
                {getErrorMessage(error)}
              </p>
              
              {error && (
                <p className="text-red-400 text-xs">
                  Алдааны код: {error}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="w-full space-y-4">
              <Link href="/role-selection">
                <button className="w-full bg-white text-black px-6 py-3 rounded-[40px] hover:bg-gray-100 transition-colors">
                  Дахин оролдох
                </button>
              </Link>
              
              <Link href="/">
                <button className="w-full text-white border border-white/30 px-6 py-3 rounded-[40px] hover:bg-white/10 transition-colors">
                  Нүүр хуудас руу буцах
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
}

export default function AuthError() {
  return (
    <Suspense fallback={
      <div className="relative w-full h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  );
}