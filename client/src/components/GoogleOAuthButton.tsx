"use client";

import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

interface GoogleOAuthButtonProps {
  onSuccess?: (session: any) => void;
  onError?: (error: string) => void;
  text?: string;
  className?: string;
  disabled?: boolean;
}

export default function GoogleOAuthButton({
  onSuccess,
  onError,
  text = "Google-р нэвтрэх",
  className = "",
  disabled = false,
}: GoogleOAuthButtonProps) {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const handleGoogleSignIn = async () => {
    if (disabled || loading) return;

    setLoading(true);
    
    try {
      const result = await signIn("google", {
        redirect: false,
        callbackUrl: window.location.origin,
      });

      if (result?.error) {
        console.error("Google sign-in error:", result.error);
        onError?.(result.error);
      } else if (result?.ok) {
        // Wait a moment for session to be available
        setTimeout(() => {
          if (session) {
            onSuccess?.(session);
          }
        }, 1000);
      }
    } catch (error: any) {
      console.error("Google OAuth error:", error);
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
      <span className="font-medium">
        {loading ? "Нэвтэрч байна..." : text}
      </span>
    </button>
  );
}