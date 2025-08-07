"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
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
  const [pendingAuth, setPendingAuth] = useState(false);
  const { data: session, status } = useSession();

  // Handle session changes after OAuth
  useEffect(() => {
    if (pendingAuth && status === "authenticated" && session) {
      setPendingAuth(false);
      setLoading(false);
      onSuccess?.(session);
    } else if (pendingAuth && status === "unauthenticated") {
      setPendingAuth(false);
      setLoading(false);
      onError?.("Authentication failed");
    }
  }, [session, status, pendingAuth, onSuccess, onError]);

  const handleGoogleSignIn = async () => {
    console.log("Google sign-in button clicked");
    if (disabled || loading) return;

    console.log("Starting Google OAuth flow...");
    setLoading(true);
    setPendingAuth(true);
    
    try {
      console.log("Calling signIn with Google provider...");
      const result = await signIn("google", {
        redirect: false,
        callbackUrl: window.location.href,
      });
      console.log("SignIn result:", result);

      if (result?.error) {
        console.error("Google sign-in error:", result.error);
        setPendingAuth(false);
        setLoading(false);
        onError?.(result.error);
      } else if (!result?.ok) {
        setPendingAuth(false);
        setLoading(false);
        onError?.("Google authentication failed");
      }
      // If result.ok is true, we wait for the session to update via useEffect
    } catch (error: any) {
      console.error("Google OAuth error:", error);
      setPendingAuth(false);
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
      <span className="font-medium">
        {loading ? "Нэвтэрч байна..." : text}
      </span>
    </button>
  );
}