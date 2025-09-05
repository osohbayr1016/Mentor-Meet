"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useFirebaseAuth } from "@/lib/firebase-auth";
import {
  convertFirebaseUser,
  storeFirebaseUser,
} from "@/lib/firebase-integration";

interface GoogleOAuthButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  text?: string;
  className?: string;
  disabled?: boolean;
  userType?: "student" | "mentor";
}

export default function GoogleOAuthButton({
  onSuccess,
  onError,
  text = "Google-р нэвтрэх",
  className = "",
  disabled = false,
  userType = "student",
}: GoogleOAuthButtonProps) {
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle } = useFirebaseAuth();

  const handleGoogleSignIn = async () => {
    console.log("Firebase Google sign-in button clicked");
    if (disabled || loading) return;

    console.log("Starting Firebase Google OAuth flow...");
    setLoading(true);

    try {
      console.log("Calling Firebase signInWithGoogle...");
      const user = await signInWithGoogle();

      if (user) {
        const userData = convertFirebaseUser(user, userType);
        storeFirebaseUser(userData);
        console.log("Firebase Google sign-in successful:", userData);
        onSuccess?.();
      }
    } catch (error: any) {
      console.error("Firebase Google OAuth error:", error);
      setLoading(false);
      onError?.(error.message || "Google-р нэвтрэхэд алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={disabled || loading}
      className={`
        w-full flex items-center justify-center gap-3 px-4 py-3 
        bg-white text-gray-700 border border-gray-300 rounded-[40px] 
        hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 
        transition-colors disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      <FcGoogle size={20} />
      <span className="font-medium">{loading ? "Нэвтэрч байна..." : text}</span>
    </button>
  );
}
