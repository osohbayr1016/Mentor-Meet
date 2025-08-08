"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function MentorOAuthCallback() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (status === "loading") return;

      if (status === "unauthenticated") {
        router.replace("/auth/error?error=OAuthSignin");
        return;
      }

      try {
        // First, check if mentor exists and can login via Google
        const checkRes = await fetch(`${API_BASE_URL}/mentorEmail`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: session?.user?.email,
            googleAuth: true,
          }),
        });
        const checkData = await checkRes.json();

        if (checkData?.userExists) {
          // Try Google login
          const loginRes = await fetch(`${API_BASE_URL}/mentorLogin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: session?.user?.email,
              googleAuth: true,
            }),
          });
          const loginData = await loginRes.json();
          if (!loginRes.ok || !loginData?.token) {
            throw new Error(loginData?.message || "Google login failed");
          }

          localStorage.setItem("mentorToken", loginData.token);
          localStorage.setItem("mentorEmail", session?.user?.email || "");
          localStorage.setItem("mentorUser", JSON.stringify(loginData.mentor));
          router.replace("/create-profile");
          return;
        }

        // If mentor does not exist, sign them up
        const signupRes = await fetch(`${API_BASE_URL}/mentorSignup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: session?.user?.email,
            password: "",
            googleAuth: true,
            googleData: {
              name: session?.user?.name,
              image: session?.user?.image,
              accessToken: (session as any)?.accessToken,
            },
          }),
        });
        const signupData = await signupRes.json();
        if (!signupRes.ok || !signupData?.token) {
          throw new Error(signupData?.message || "Google signup failed");
        }

        localStorage.setItem("mentorToken", signupData.token);
        localStorage.setItem("mentorEmail", session?.user?.email || "");
        localStorage.setItem(
          "mentorUser",
          JSON.stringify({
            mentorId: signupData.mentorId,
            email: session?.user?.email,
            isAdmin: false,
            firstName: session?.user?.name?.split(" ")[0] || "",
            lastName: session?.user?.name?.split(" ").slice(1).join(" ") || "",
            image: session?.user?.image,
          })
        );
        router.replace("/create-profile");
      } catch (e: any) {
        setError(e.message || "OAuth callback failed");
      }
    };

    run();
  }, [status, session, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-white/90 text-center">
        {error ? (
          <>
            <p>Google нэвтрэлт амжилтгүй боллоо.</p>
            <p className="text-red-400 mt-2 text-sm">{error}</p>
          </>
        ) : (
          <p>Google нэвтрэлтийг баталгаажуулж байна...</p>
        )}
      </div>
    </div>
  );
}
