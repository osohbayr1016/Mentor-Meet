"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function StudentOAuthCallback() {
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
        const response = await fetch(`${API_BASE_URL}/studentLogin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: session?.user?.email,
            googleAuth: true,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          // If the student doesn't exist yet, auto-create via Google signup path
          if (response.status === 400) {
            const signupRes = await fetch(`${API_BASE_URL}/StudentNameNumber`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: session?.user?.email,
                nickname: session?.user?.name?.split(" ")[0] || "Student",
                phoneNumber: "",
                googleAuth: true,
              }),
            });
            const signupData = await signupRes.json();
            if (!signupRes.ok) {
              throw new Error(signupData?.message || "Google signup failed");
            }
            localStorage.setItem("studentToken", signupData.token);
            localStorage.setItem(
              "studentUser",
              JSON.stringify(signupData.user)
            );
            localStorage.setItem(
              "studentEmail",
              signupData.user?.email || session?.user?.email || ""
            );
            window.dispatchEvent(new Event("authChange"));
            router.replace("/student-dashboard");
            return;
          }
          throw new Error(data?.message || "Google login failed");
        }

        localStorage.setItem("studentToken", data.token);
        localStorage.setItem("studentUser", JSON.stringify(data.user));
        localStorage.setItem(
          "studentEmail",
          data.user?.email || session?.user?.email || ""
        );
        window.dispatchEvent(new Event("authChange"));
        router.replace("/student-dashboard");
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
