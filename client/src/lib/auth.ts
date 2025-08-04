"use client";

import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: [
            "openid",
            "email",
            "profile",
            "https://www.googleapis.com/auth/calendar",
            "https://www.googleapis.com/auth/calendar.events",
          ].join(" "),
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token and refresh_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like the access_token from a provider
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.expiresAt = token.expiresAt;
      return session;
    },
    async signIn({ account, profile }) {
      // Add debugging for OAuth issues
      console.log("SignIn callback:", { account, profile });
      return true;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error", // Add error page
  },
  session: {
    strategy: "jwt",
  },
  // Add this for development - allows unverified apps
  debug: process.env.NODE_ENV === "development",
  // Add error handling
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log("SignIn event:", { user, account, profile, isNewUser });
    },
    async signOut({ session, token }) {
      console.log("SignOut event:", { session, token });
    },
  },
  // Add error handling for client fetch errors
  logger: {
    error(code, ...message) {
      console.error(`[NextAuth][error][${code}]`, ...message);
    },
    warn(code, ...message) {
      console.warn(`[NextAuth][warn][${code}]`, ...message);
    },
    debug(code, ...message) {
      if (process.env.NODE_ENV === "development") {
        console.log(`[NextAuth][debug][${code}]`, ...message);
      }
    },
  },
};

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  }
}

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
