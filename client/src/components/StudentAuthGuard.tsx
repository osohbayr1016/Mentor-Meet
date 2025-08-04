"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface StudentAuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

const StudentAuthGuard = ({
  children,
  redirectTo = "/student-login",
  fallback,
}: StudentAuthGuardProps) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = () => {
      try {
        const studentToken = localStorage.getItem("studentToken");
        const studentUser = localStorage.getItem("studentUser");

        if (!studentToken || !studentUser) {
          // No token found, redirect to login
          router.push(redirectTo);
          return;
        }

        // Verify that studentUser is valid JSON
        JSON.parse(studentUser);
        setIsAuthenticated(true);
      } catch (error) {
        // Invalid JSON, clear localStorage and redirect
        localStorage.removeItem("studentToken");
        localStorage.removeItem("studentUser");
        localStorage.removeItem("studentEmail");
        router.push(redirectTo);
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "studentToken" || e.key === "studentUser") {
        checkAuthentication();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("authChange", checkAuthentication);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChange", checkAuthentication);
    };
  }, [router, redirectTo]);

  // Show loading or fallback while checking authentication
  if (loading) {
    return (
      fallback || (
        <div className="relative w-full h-screen">
          <div className="absolute inset-0 bg-black/30 -z-10" />
          <div className="relative z-10 min-h-screen flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-white text-center">
                <div className="w-8 h-8 border border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                <p>Нэвтрэх эрх шалгаж байна...</p>
              </div>
            </div>
          </div>
        </div>
      )
    );
  }

  // If not authenticated, don't render children (redirect will happen)
  if (!isAuthenticated) {
    return null;
  }

  // If authenticated, render children
  return <>{children}</>;
};

export default StudentAuthGuard;
