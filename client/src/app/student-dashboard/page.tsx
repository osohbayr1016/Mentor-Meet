"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BookingCard from "../../components/BookingCard";
import MentorCard from "./_components/MentorCard";
import StudentAuthGuard from "../../components/StudentAuthGuard";

interface Mentor {
  _id: string;
  firstName: string;
  lastName: string;
  image: string;
  profession: string;
  rating: number;
}

interface Booking {
  _id: string;
  mentorId: Mentor;
  date: string;
  time: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  price: number;
  category: string;
}

interface BookingsData {
  upcoming: Booking[];
  past: Booking[];
}

const StudentDashboard = () => {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "upcoming" | "history" | "mentor-profile"
  >("mentor-profile");
  const [totalSpent, setTotalSpent] = useState(0);

  // Get student ID from localStorage
  const [studentId, setStudentId] = useState("");

  useEffect(() => {
    // Get student data from localStorage
    try {
      const studentUser = localStorage.getItem("studentUser");
      if (studentUser) {
        const studentData = JSON.parse(studentUser);
        const id =
          studentData.id || studentData._id || studentData.studentId || "";
        if (id) {
          setStudentId(id);
        } else {
          console.error("No valid student ID found in localStorage");
          setLoading(false);
        }
      } else {
        console.error("No student user data found in localStorage");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error parsing student data:", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (studentId && studentId.trim() !== "") {
      fetchBookings();
    }
  }, [studentId]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      console.log("Fetching bookings for studentId:", studentId);
      const response = await fetch(
        `/api/get-booking-mentor?studentId=${studentId}`
      );
      const data = await response.json();
      console.log("Booking data received:", data);

      if (data.success) {
        // Transform the data to match the existing interface
        const transformedData = data.data.reduce(
          (acc: any, booking: any) => {
            const bookingItem = {
              _id: booking._id,
              mentorId: {
                _id: booking.mentorId,
                firstName: booking.mentorName.split(" ")[0] || "",
                lastName:
                  booking.mentorName.split(" ").slice(1).join(" ") || "",
                image:
                  booking.mentorImage ||
                  "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face",
                profession: booking.mentorProfession || "Ментор",
                rating: booking.mentorRating || 0,
              },
              date: booking.meetingDate,
              time: booking.meetingTime,
              status: booking.status || "PENDING",
              price: booking.price,
              category: booking.category || "Ерөнхий",
            };

            // Separate upcoming and past bookings
            const meetingDate = new Date(booking.meetingDate);
            const now = new Date();

            if (meetingDate > now && booking.status !== "CANCELLED") {
              acc.upcoming.push(bookingItem);
            } else {
              acc.past.push(bookingItem);
            }

            return acc;
          },
          { upcoming: [], past: [] }
        );

        setBookings(transformedData);

        // Calculate total spent from all bookings
        const allBookings = [
          ...transformedData.upcoming,
          ...transformedData.past,
        ];
        const total = allBookings.reduce(
          (sum, booking) => sum + (booking.price || 0),
          0
        );
        setTotalSpent(total);
      } else {
        console.error("Failed to fetch bookings:", data.message);
        setBookings({ upcoming: [], past: [] });
        setTotalSpent(0);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings({ upcoming: [], past: [] });
      setTotalSpent(0);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinMeeting = async (bookingId: string) => {
    try {
      const response = await fetch("/api/join-meeting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingId, studentId }),
      });

      const data = await response.json();

      if (data.success) {
        // Open meeting link in new tab
        window.open(data.data.meetingLink, "_blank");
      } else {
        alert("Failed to join meeting: " + data.message);
      }
    } catch (error) {
      console.error("Error joining meeting:", error);
      alert("Error joining meeting. Please try again.");
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Уулзалтыг цуцлахдаа итгэлтэй байна уу?")) {
      return;
    }

    try {
      const response = await fetch("/api/cancel-booking", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingId, studentId }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Уулзалт амжилттай цуцлагдлаа.");
        fetchBookings(); // Refresh bookings
      } else {
        alert("Failed to cancel booking: " + data.message);
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Error cancelling booking. Please try again.");
    }
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("studentToken");
    localStorage.removeItem("studentUser");
    localStorage.removeItem("studentEmail");

    // Dispatch custom event to notify other components about auth change
    window.dispatchEvent(new Event("authChange"));

    // Redirect to login page
    router.push("/");
  };

  // Show loading while fetching data
  if (loading) {
    return (
      <div className="relative w-full h-screen">
        <div className="absolute inset-0 bg-black/30 -z-10" />
        <Image
          src="https://images.unsplash.com/photo-1706074740295-d7a79c079562?q=80&w=2232&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="background image"
          fill
          className="absolute inset-0 -z-20 object-cover"
          priority
        />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="text-white text-center">
              <div className="w-8 h-8 border border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
              <p>Уншиж байна...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <StudentAuthGuard>
      <div className="relative w-full min-h-screen">
        {/* Background image */}
        <div className="absolute inset-0 bg-black/30 -z-10" />
        <Image
          src="https://images.unsplash.com/photo-1706074740295-d7a79c079562?q=80&w=2232&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="background image"
          fill
          className="absolute inset-0 -z-20 object-cover"
          priority
        />

        {/* Main Dashboard */}
        <div className="relative z-10 w-full min-h-screen flex flex-col">
          {/* Main Content */}
          <div className="flex-1 px-6 pb-10 pt-3 ">
            <div className="max-w-6xl mx-auto">
              {/* Main Dashboard Panel */}
              <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-white/20 h-[650px] w-full">
                <div className="flex gap-8 h-full">
                  {/* Left Sidebar */}
                  <div className="w-72 flex flex-col h-full justify-between">
                    <div className="space-y-2">
                      <button
                        onClick={() => setActiveTab("mentor-profile")}
                        className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors ${
                          activeTab === "upcoming"
                            ? "bg-gray-600 text-white"
                            : "text-gray-300 hover:bg-gray-700/50"
                        }`}
                      >
                        Товлосон уулзалтууд
                      </button>
                      <button
                        onClick={() => setActiveTab("history")}
                        className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors ${
                          activeTab === "history"
                            ? "bg-gray-600 text-white"
                            : "text-gray-300 hover:bg-gray-700/50"
                        }`}
                      >
                        Уулзалтын түүх
                      </button>
                    </div>

                    <div className="mt-auto space-y-2">
                      <button
                        onClick={() => router.push("/explore")}
                        className="w-full text-left px-4 py-3 rounded-xl font-medium text-gray-300 hover:bg-gray-700/50 transition-colors flex items-center gap-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                        Ментор хайх
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 rounded-xl font-medium text-gray-300 hover:bg-gray-700/50 transition-colors flex items-center gap-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Гарах
                      </button>
                    </div>
                  </div>

                  {/* Right Content Area */}
                  <div className="flex-1 flex flex-col">
                    {/* Income Section */}
                    <div className="mb-6">
                      <p className="text-gray-300 text-sm mb-1">
                        Таны нийт зарцуулсан мөнгө:
                      </p>
                      <p className="text-green-400 text-2xl font-bold">
                        ₮{totalSpent.toLocaleString()}
                      </p>
                    </div>

                    {/* Content Section */}
                    <div className="overflow-y-auto">
                      {activeTab === "mentor-profile" ? (
                        // Mentor Profile Section
                        <div className="flex-1 flex flex-col ">
                          <h3 className="text-white text-lg font-semibold mb-4">
                            Таны товлосон уулзалтууд:
                          </h3>

                          <div className="flex gap-4 flex-1 overflow-x-auto  ">
                            {(() => {
                              const allBookings = [
                                ...(bookings?.upcoming || []),
                                ...(bookings?.past || []),
                              ];

                              return allBookings.length > 0 ? (
                                allBookings
                                  .slice(0, 2)
                                  .map((booking) => (
                                    <MentorCard
                                      key={booking._id}
                                      booking={booking}
                                      onCancel={handleCancelBooking}
                                    />
                                  ))
                              ) : (
                                <div className="flex items-center justify-center h-64 w-full">
                                  <div className="text-center text-gray-400">
                                    <p className="text-lg font-medium mb-2">
                                      Ментор профиль байхгүй байна
                                    </p>
                                    <p className="text-sm">
                                      Уулзалт захиалсны дараа энд харагдана
                                    </p>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      ) : (
                        // Meetings Section
                        <div className="flex-1 flex flex-col  ">
                          <h3 className="text-white text-lg font-semibold mb-4">
                            {activeTab === "upcoming"
                              ? "Таны товлосон уулзалтууд:"
                              : "Уулзалтын түүх:"}
                          </h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1  ">
                            {(() => {
                              const currentBookings =
                                activeTab === "upcoming"
                                  ? bookings?.upcoming || []
                                  : bookings?.past || [];

                              return currentBookings.length > 0 ? (
                                currentBookings.map((booking) => (
                                  <BookingCard
                                    key={booking._id}
                                    booking={booking}
                                    onJoinMeeting={
                                      activeTab === "upcoming"
                                        ? handleJoinMeeting
                                        : undefined
                                    }
                                    onCancelBooking={
                                      activeTab === "upcoming"
                                        ? handleCancelBooking
                                        : undefined
                                    }
                                    showActions={activeTab === "upcoming"}
                                  />
                                ))
                              ) : (
                                <div className="col-span-2 flex items-center justify-center h-64">
                                  <div className="text-center text-gray-400">
                                    <p className="text-lg font-medium mb-2">
                                      {activeTab === "upcoming"
                                        ? "Товлосон уулзалт байхгүй байна"
                                        : "Уулзалтын түүх байхгүй байна"}
                                    </p>
                                    <p className="text-sm">
                                      {activeTab === "upcoming"
                                        ? "Ментор хайж уулзалт захиалаарай"
                                        : "Уулзалтын түүх энд харагдана"}
                                    </p>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Copyright Footer */}
          <div className="fixed bottom-2 left-6 text-xs text-white/60 z-30">
            <div>Copyright © 2025 Mentor Meet</div>
            <div>All rights reserved.</div>
          </div>
        </div>
      </div>
    </StudentAuthGuard>
  );
};

export default StudentDashboard;
