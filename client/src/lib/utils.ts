import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Student authentication utilities
export const checkStudentAuth = () => {
  if (typeof window === "undefined") {
    return { isAuthenticated: false, student: null };
  }

  try {
    const studentToken = localStorage.getItem("studentToken");
    const studentUserStr = localStorage.getItem("studentUser");

    if (!studentToken || !studentUserStr) {
      return { isAuthenticated: false, student: null };
    }

    const student = JSON.parse(studentUserStr);
    return { isAuthenticated: true, student };
  } catch (error) {
    console.error("Error checking student auth:", error);
    return { isAuthenticated: false, student: null };
  }
};

export const clearStudentAuth = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("studentToken");
  localStorage.removeItem("studentUser");
  localStorage.removeItem("studentEmail");

  // Dispatch custom event to notify other components
  window.dispatchEvent(new Event("authChange"));
};

export const requireStudentAuth = (redirectTo: string = "/student-login") => {
  if (typeof window === "undefined") return;

  const { isAuthenticated } = checkStudentAuth();

  if (!isAuthenticated) {
    window.location.href = redirectTo;
    return false;
  }

  return true;
};

// Handle NextAuth errors gracefully
export const handleNextAuthError = (error: any) => {
  // Check if it's a NextAuth client fetch error
  if (
    error?.message?.includes("CLIENT_FETCH_ERROR") ||
    error?.message?.includes("Unexpected end of JSON input")
  ) {
    console.warn("NextAuth error handled gracefully:", error.message);
    return true; // Error was handled
  }

  // For other errors, let them propagate
  return false;
};

// Safe NextAuth session check
export const safeSessionCheck = () => {
  try {
    // This will be handled by the ErrorBoundary if it fails
    return true;
  } catch (error) {
    if (handleNextAuthError(error)) {
      return false; // Error was handled, return false to indicate no session
    }
    throw error; // Re-throw other errors
  }
};
