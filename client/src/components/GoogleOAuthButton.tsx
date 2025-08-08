"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

interface GoogleOAuthButtonProps {
  onSuccess?: (session: any) => void;
  onError?: (error: string) => void;
  text?: string;
  className?: string;
  disabled?: boolean;
  callbackUrl?: string;
}

export default function GoogleOAuthButton({
  onSuccess,
  onError,
  text = "Google-р нэвтрэх",
  className = "",
  disabled = false,
  callbackUrl,
}: GoogleOAuthButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    console.log("Google sign-in button clicked");
    if (disabled || loading) return;

    console.log("Starting Google OAuth flow...");
    setLoading(true);

    try {
      console.log("Calling signIn with Google provider (redirect)...");
      // For OAuth providers, allow full redirect and come back to a callback page
      await signIn("google", {
        callbackUrl: callbackUrl || window.location.origin + "/role-selection",
      });
    } catch (error: any) {
      console.error("Google OAuth error:", error);
      setLoading(false);
      onError?.(error.message || "Google-р нэвтрэхэд алдаа гарлаа");
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
