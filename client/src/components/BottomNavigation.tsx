"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useAuth } from "../app/_components/MentorUserProvider";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import axios from "axios";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";

interface StudentData {
  studentId: string;
  email: string;
  firstName: string;
  lastName: string;
  _id: string;
}

const BottomNavigation = () => {
  const pathname = usePathname();
  const { mentor, isLoading } = useAuth();
  const [student, setStudent] = useState<StudentData | null>(null);
  const [notification, setNotification] = useState([]);
  const [unRead, setUnRead] = useState(false);
  const [booking, setBooking] = useState<any>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const params = useParams();
  const mentorId = params.id as string;
  // Check for student authentication
  useEffect(() => {
    const checkStudentAuth = () => {
      try {
        const studentToken = localStorage.getItem("studentToken");
        const studentUserStr = localStorage.getItem("studentUser");
        console.log(studentUserStr, "student id");

        if (studentToken && studentUserStr) {
          const studentData = JSON.parse(studentUserStr) as StudentData;
          // const studentDataRaw = JSON.parse(studentUserStr);
          // const studentData: StudentData = {
          //   ...studentDataRaw,
          //   studentId: studentDataRaw.id,
          // };

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

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "studentToken" || e.key === "studentUser") {
        checkStudentAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Listen for custom events (when user logs in/out in same tab)
    const handleAuthChange = () => {
      // Small delay to ensure localStorage is updated
      setTimeout(() => {
        checkStudentAuth();
      }, 100);
    };

    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChange", handleAuthChange);
    };
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
    "/mentor-signup",
    "/student-signup",
    "/mentor-login",
    "/student-login",
    "/mentor-resPass",
    "/student-resPass",
  ];

  // Show notification bell only when either mentor or student is logged in
  const isLoggedIn = mentor || student;

  useEffect(() => {
    const fetchNotifications = async () => {
      const userId = mentor?.mentorId;

      if (!userId) return;

      try {
        console.log(mentor?.mentorId, "id");
        const response = await axios.get(
          `http://localhost:8000/notification/${userId}`
        );
        const data: any = response.data;

        setNotification(data.notification);
        setUnRead(data.notification?.some((n: any) => !n.checked));
      } catch (err) {
        console.error("Error fetching notifications", err);
      }
    };

    fetchNotifications();
  }, [mentor]);

  const handleBellClick = async () => {
    setIsDialogOpen(true);
    const userId = mentor?.mentorId;
    if (!userId) return;
    try {
      const response: any = await axios.get(
        `http://localhost:8000/get-booking/${userId}`
      );

      setBooking(response.data.data);
    } catch (error) {
      console.error("Failed to fetch booking:", error);
    }
  };

  if (hideNavigationPages.includes(pathname)) {
    return null;
  }

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 rounded-full overflow-hidden bg-[#737373]/60 backdrop-blur-2xl">
      <div>
        <div className="flex justify-center items-center px-2 py-2">
          <div className="flex gap-2">
            {/* Home Button */}
            <Link
              href="/"
              className={`w-[168px] h-10 py-2 rounded-full flex items-center justify-center ${
                pathname === "/"
                  ? "font-medium text-white border-white/60 bg-black/30"
                  : "text-white/70 hover:text-white hover:border-white/40"
              }`}
            >
              Нүүр хуудас
            </Link>

            {/* Mentors Button */}
            <Link
              href="/explore"
              className={`w-[168px] h-10 py-2 rounded-full flex items-center justify-center ${
                pathname === "/explore"
                  ? "font-medium text-white border-white/60 bg-black/30"
                  : "text-white/70 hover:text-white hover:border-white/40 "
              }`}
            >
              Менторууд
            </Link>

            {/* Dynamic Third Button */}
            <Link
              href={thirdButton.href}
              className={`w-[168px] h-10 py-2 rounded-full flex items-center justify-center ${
                thirdButton.isActive
                  ? "font-medium text-white border-white/60 bg-black/30"
                  : "text-white/70 hover:text-white border-white/20 hover:border-white/40"
              }`}
            >
              {thirdButton.text}
            </Link>

            <button
              onClick={() => handleBellClick()}
              className="relative p-2 text-white/70 hover:text-white transition-colors"
            >
              {unRead && (
                <span className="absolute top-1 right-1 w-3 h-3 bg-red-600 rounded-full" />
              )}
              <Bell size={20} />
            </button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="max-w-md mx-auto p-4 bg-white rounded shadow-lg">
                <DialogTitle className="text-lg font-semibold mb-2">
                  Захиалгууд
                </DialogTitle>
                {booking?.length > 0 ? (
                  <ul className="space-y-2">
                    {booking?.map((b: any, index: number) => (
                      <li key={index} className="border p-2 rounded text-black">
                        <p>Цаг: {b?.meetingTime}</p>
                        <p>Төлөв: {b?.status}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">Захиалга алга байна.</p>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;
