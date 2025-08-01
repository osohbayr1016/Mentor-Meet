"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../app/_components/MentorUserProvider";
import { useEffect, useState } from "react";

interface StudentData {
  studentId: string;
  email: string;
  firstName: string;
  lastName: string;
  // Add other student fields as needed
}

const BottomNavigation = () => {
  const pathname = usePathname();
  const { mentor, isLoading } = useAuth();
  const [student, setStudent] = useState<StudentData | null>(null);

  // Check for student authentication
  useEffect(() => {
    const checkStudentAuth = () => {
      try {
        const studentToken = localStorage.getItem("studentToken");
        const studentUserStr = localStorage.getItem("studentUser");

        if (studentToken && studentUserStr) {
          const studentData = JSON.parse(studentUserStr) as StudentData;
          setStudent(studentData);
        } else {
          setStudent(null);
        }
      } catch (error) {
        console.error("Error parsing student data:", error);
        setStudent(null);
      }
    };

    checkStudentAuth();
  }, []);

  // Determine the third button text and link based on current page and auth state
  const getThirdButtonConfig = () => {
    // If mentor is logged in, show "Профайл" and navigate to mentor-dashboard
    if (mentor) {
      return {
        text: "Профайл",
        href: "/mentor-dashboard",
        isActive: pathname === "/mentor-dashboard",
      };
    }

    // If student is logged in, show "Профайл" and navigate to student-dashboard
    if (student) {
      return {
        text: "Профайл",
        href: "/student-dashboard",
        isActive: pathname === "/student-dashboard",
      };
    }

    // If user is on signup pages, show "Бүртгүүлэх"
    if (pathname.includes("signup")) {
      return {
        text: "Бүртгүүлэх",
        href: "/role-selection",
        isActive: false,
      };
    }

    // If user is on login pages, show "Нэвтрэх"
    if (pathname.includes("login")) {
      return {
        text: "Нэвтрэх",
        href: "/role-selection",
        isActive: false,
      };
    }

    // Default for other pages when not logged in
    return {
      text: "Бүртгүүлэх",
      href: "/role-selection",
      isActive: false,
    };
  };

  const thirdButton = getThirdButtonConfig();

  // Don't show navigation on certain pages
  const hideNavigationPages = [
    "/role-selection",
    "/create-profile",
    "/mentor-dashboard",
    "/mentor-signup",
    "/student-signup",
    "/mentor-login",
    "/student-login",
    "/mentor-resPass",
    "/student-resPass",
  ];

  if (hideNavigationPages.includes(pathname)) {
    return null;
  }

  // Show notification bell only when either mentor or student is logged in
  const isLoggedIn = mentor || student;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div className="backdrop-blur-2xl border-t border-white/10 bg-black/20">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex justify-center items-center">
            <div className="flex space-x-6">
              {/* Home Button */}
              <Link
                href="/"
                className={`px-6 py-2 transition-colors rounded-xl backdrop-blur-sm border text-sm ${
                  pathname === "/"
                    ? "font-medium bg-white/30 text-white border-white/60"
                    : "text-white/70 hover:text-white border-white/20 hover:border-white/40"
                }`}
              >
                Нүүр хуудас
              </Link>

              {/* Mentors Button */}
              <Link
                href="/explore"
                className={`px-6 py-2 transition-colors rounded-xl backdrop-blur-sm border text-sm ${
                  pathname === "/explore"
                    ? "font-medium bg-white/30 text-white border-white/60"
                    : "text-white/70 hover:text-white border-white/20 hover:border-white/40"
                }`}
              >
                Менторууд
              </Link>

              {/* Dynamic Third Button */}
              <Link
                href={thirdButton.href}
                className={`px-6 py-2 transition-colors rounded-xl backdrop-blur-sm border text-sm ${
                  thirdButton.isActive
                    ? "font-medium bg-white/30 text-white border-white/60"
                    : "text-white/70 hover:text-white border-white/20 hover:border-white/40"
                }`}
              >
                {thirdButton.text}
              </Link>
              {isLoggedIn && (
                <div className="flex items-center">
                  <button className="p-2 text-white/70 hover:text-white transition-colors">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Notification Bell - Only show when logged in */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;
