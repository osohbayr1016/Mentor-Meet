"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useAuth } from "../app/_components/MentorUserProvider";
import { useEffect, useState, useRef } from "react";
import {
  Bell,
  X,
  Clock,
  User,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface StudentData {
  studentId: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface Booking {
  _id: string;
  date: string;
  time: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  price: number;
  category: string;
  studentId?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}

interface Notification {
  _id: string;
  mentorId: string;
  bookingId: Booking;
  checked: boolean;
  createdAt: string;
  updatedAt: string;
}

const BottomNavigation = () => {
  const pathname = usePathname();
  const { mentor, isLoading } = useAuth();
  const [student, setStudent] = useState<StudentData | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const params = useParams();
  const mentorId = params.id as string;
  const notificationRef = useRef<HTMLDivElement>(null);

  // Check for student authentication
  useEffect(() => {
    const checkStudentAuth = () => {
      try {
        const studentToken = localStorage.getItem("studentToken");
        const studentUserStr = localStorage.getItem("studentUser");
        console.log(studentUserStr, "student id");

        if (studentToken && studentUserStr) {
          // const studentData = JSON.parse(studentUserStr) as StudentData;
          const studentDataRaw = JSON.parse(studentUserStr);
          const studentData: StudentData = {
            ...studentDataRaw,
            studentId: studentDataRaw.id,
          };

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

  // Fetch notifications
  const fetchNotifications = async () => {
    const userId = mentor?.mentorId;
    if (!userId) return;

    setIsLoadingNotifications(true);
    try {
      console.log(mentor?.mentorId, "id");
      const response = await axios.get(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/notification/${userId}`
      );
      const data: any = response.data;

      console.log("Notifications fetched:", data.notification);

      setNotifications(data.notification || []);
      const unread =
        data.notification?.filter((n: Notification) => !n.checked) || [];
      setUnreadCount(unread.length);
    } catch (err) {
      console.error("Error fetching notifications", err);
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      // For now, just update local state since the API endpoint might not exist
      // You can uncomment the API call when the backend endpoint is ready
      /*
      await axios.patch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/notification/${notificationId}/read`
      );
      */

      // Update local state immediately for better UX
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId ? { ...n, checked: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error marking notification as read", err);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.checked);
      if (unreadNotifications.length === 0) return;

      // For now, just update local state since the API endpoint might not exist
      // You can uncomment the API call when the backend endpoint is ready
      /*
      await axios.patch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/notification/mark-all-read`,
        { mentorId: mentor?.mentorId }
      );
      */

      // Update local state immediately for better UX
      setNotifications((prev) => prev.map((n) => ({ ...n, checked: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all notifications as read", err);
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.checked) {
      markAsRead(notification._id);
    }
    // You can add navigation logic here if needed
  };

  // Get status color and icon
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          color: "text-yellow-600",
          bgColor: "bg-yellow-100",
          icon: AlertCircle,
        };
      case "CONFIRMED":
        return {
          color: "text-green-600",
          bgColor: "bg-green-100",
          icon: CheckCircle,
        };
      case "CANCELLED":
        return { color: "text-red-600", bgColor: "bg-red-100", icon: X };
      case "COMPLETED":
        return {
          color: "text-blue-600",
          bgColor: "bg-blue-100",
          icon: CheckCircle,
        };
      default:
        return { color: "text-gray-600", bgColor: "bg-gray-100", icon: Clock };
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("mn-MN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format time
  const formatTime = (timeString: string) => {
    return timeString;
  };

  // Close notification popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    };

    if (isNotificationOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationOpen]);

  // Fetch notifications when popover opens
  useEffect(() => {
    if (isNotificationOpen && mentor) {
      fetchNotifications();
    }
  }, [isNotificationOpen, mentor]);

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
              className={`w-[168px] h-10 py-2 rounded-full flex items-center justify-center transition-all duration-200 ${
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
              className={`w-[168px] h-10 py-2 rounded-full flex items-center justify-center transition-all duration-200 ${
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
              className={`w-[168px] h-10 py-2 rounded-full flex items-center justify-center transition-all duration-200 ${
                thirdButton.isActive
                  ? "font-medium text-white border-white/60 bg-black/30"
                  : "text-white/70 hover:text-white border-white/20 hover:border-white/40"
              }`}
            >
              {thirdButton.text}
            </Link>

            {/* Notification Bell */}
            {isLoggedIn && (
              <Popover
                open={isNotificationOpen}
                onOpenChange={setIsNotificationOpen}
              >
                <PopoverTrigger asChild>
                  <button
                    onClick={() => {
                      if (!isNotificationOpen) {
                        fetchNotifications();
                      }
                    }}
                    className="relative p-2 text-white/70 hover:text-white transition-all duration-200 hover:scale-110"
                  >
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold animate-pulse">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                    <Bell
                      size={20}
                      className="transition-transform duration-200 hover:rotate-12"
                    />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-80 p-0 border-0 shadow-2xl bg-[#333333]/60 backdrop-blur-md border border-white/30 rounded-[20px]"
                  align="end"
                  side="top"
                  sideOffset={8}
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-[#333333]/80 to-[#444444]/80 text-white p-4 rounded-t-[20px]">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Bell size={18} />
                        Мэдэгдэл
                      </h3>
                      <button
                        onClick={() => setIsNotificationOpen(false)}
                        className="text-white/80 hover:text-white transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>
                    {unreadCount > 0 && (
                      <p className="text-sm text-white/90 mt-1">
                        {unreadCount} шинэ мэдэгдэл
                      </p>
                    )}
                  </div>

                  {/* Notifications List */}
                  <div className="max-h-96 overflow-y-auto">
                    {isLoadingNotifications ? (
                      <div className="p-4 text-center text-white/60">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 mx-auto"></div>
                        <p className="mt-2 text-sm">Уншиж байна...</p>
                      </div>
                    ) : notifications.length > 0 ? (
                      notifications.map((notification) => {
                        // Add null check for bookingId
                        if (!notification.bookingId) {
                          return null; // Skip this notification if bookingId is null
                        }

                        const statusInfo = getStatusInfo(
                          notification.bookingId.status
                        );
                        const StatusIcon = statusInfo.icon;

                        return (
                          <div
                            key={notification._id}
                            onClick={() =>
                              handleNotificationClick(notification)
                            }
                            className={`p-4 border-b border-white/20 cursor-pointer transition-all duration-200 hover:bg-white/10 rounded-lg mx-2 my-1 ${
                              !notification.checked
                                ? "bg-white/10 border-l-4 border-l-blue-400"
                                : "bg-white/5"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {/* Status Icon */}
                              <div
                                className={`p-2 rounded-full ${statusInfo.bgColor} flex-shrink-0`}
                              >
                                <StatusIcon
                                  size={16}
                                  className={statusInfo.color}
                                />
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-2">
                                  <h4
                                    className={`font-medium text-sm ${
                                      !notification.checked
                                        ? "text-white"
                                        : "text-white/80"
                                    }`}
                                  >
                                    {notification.bookingId?.studentId
                                      ?.firstName &&
                                    notification.bookingId?.studentId?.lastName
                                      ? `${notification.bookingId.studentId.firstName} ${notification.bookingId.studentId.lastName}`
                                      : "Сурагч"}
                                  </h4>
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${statusInfo.bgColor} ${statusInfo.color}`}
                                  >
                                    {notification.bookingId?.status}
                                  </span>
                                </div>

                                {/* Booking Details */}
                                <div className="space-y-1 text-xs text-white/70">
                                  <div className="flex items-center gap-2">
                                    <Calendar size={12} />
                                    <span>
                                      {formatDate(
                                        notification.bookingId?.date || ""
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock size={12} />
                                    <span>
                                      {formatTime(
                                        notification.bookingId?.time || ""
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <User size={12} />
                                    <span>
                                      {notification.bookingId?.category ||
                                        "N/A"}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <DollarSign size={12} />
                                    <span>
                                      {notification.bookingId?.price?.toLocaleString() ||
                                        "0"}
                                      ₮
                                    </span>
                                  </div>
                                </div>

                                {/* Timestamp */}
                                <div className="mt-2 text-xs text-white/50">
                                  {formatDate(notification.createdAt)}
                                </div>
                              </div>

                              {/* Unread Indicator */}
                              {!notification.checked && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-8 text-center text-white/60">
                        <Bell
                          size={32}
                          className="mx-auto mb-3 text-white/40"
                        />
                        <p className="text-sm">Мэдэгдэл байхгүй байна</p>
                        <p className="text-xs mt-1">
                          Шинэ захиалга ирэхэд энд харагдана
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  {notifications.length > 0 && unreadCount > 0 && (
                    <div className="p-3 bg-white/10 border-t border-white/20 rounded-b-[20px]">
                      <button
                        onClick={markAllAsRead}
                        className="w-full text-center text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium"
                      >
                        Бүгдийг уншсан гэж тэмдэглэх ({unreadCount})
                      </button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;
