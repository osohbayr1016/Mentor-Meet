"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Student authentication hook
export const useStudentAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkStudentAuth = () => {
      try {
        const studentToken = localStorage.getItem("studentToken");
        const studentUserStr = localStorage.getItem("studentUser");

        if (studentToken && studentUserStr) {
          const studentData = JSON.parse(studentUserStr);
          setStudent(studentData);
          setIsAuthenticated(true);
        } else {
          setStudent(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error parsing student data:", error);
        setStudent(null);
        setIsAuthenticated(false);
        // Clear invalid data
        localStorage.removeItem("studentToken");
        localStorage.removeItem("studentUser");
        localStorage.removeItem("studentEmail");
      } finally {
        setLoading(false);
      }
    };

    checkStudentAuth();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "studentToken" || e.key === "studentUser") {
        checkStudentAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("authChange", checkStudentAuth);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChange", checkStudentAuth);
    };
  }, []);

  const requireAuth = (redirectTo: string = "/student-login") => {
    useEffect(() => {
      if (!loading && !isAuthenticated) {
        router.push(redirectTo);
      }
    }, [isAuthenticated, loading, router, redirectTo]);

    return { isAuthenticated, student, loading };
  };

  return { isAuthenticated, student, loading, requireAuth };
};

// Custom hook for handling authentication with error recovery
export const useAuthWithFallback = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authData, setAuthData] = useState<any>(null);

  useEffect(() => {
    const checkAuth = () => {
      try {
        // First try to get student authentication from localStorage
        const studentToken = localStorage.getItem("studentToken");
        const studentUser = localStorage.getItem("studentUser");

        if (studentToken && studentUser) {
          try {
            const studentData = JSON.parse(studentUser);
            setAuthData({
              type: "student",
              data: studentData,
              token: studentToken,
            });
            setError(null);
          } catch (parseError) {
            console.error("Error parsing student data:", parseError);
            setError("Invalid student data");
          }
        } else {
          // Check for mentor authentication
          const mentorToken = localStorage.getItem("mentorToken");
          const mentorUser = localStorage.getItem("mentorUser");

          if (mentorToken && mentorUser) {
            try {
              const mentorData = JSON.parse(mentorUser);
              setAuthData({
                type: "mentor",
                data: mentorData,
                token: mentorToken,
              });
              setError(null);
            } catch (parseError) {
              console.error("Error parsing mentor data:", parseError);
              setError("Invalid mentor data");
            }
          } else {
            setAuthData(null);
            setError(null);
          }
        }
      } catch (error) {
        console.error("Authentication check error:", error);
        setError("Authentication check failed");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === "studentToken" ||
        e.key === "studentUser" ||
        e.key === "mentorToken" ||
        e.key === "mentorUser"
      ) {
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("authChange", checkAuth);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChange", checkAuth);
    };
  }, []);

  return { authData, isLoading, error };
};
