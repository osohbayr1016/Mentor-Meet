"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BookingCard from "../../components/BookingCard";

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
  const [activeTab, setActiveTab] = useState<"upcoming" | "history">(
    "upcoming"
  );
  const [totalSpent] = useState(150000); // Mock data

  // Mock student ID - replace with actual auth
  const studentId = "student_123";

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/get-student-bookings?studentId=${studentId}`
      );
      const data = await response.json();

      if (data.success) {
        setBookings(data.data);
      } else {
        console.error("Failed to fetch bookings:", data.message);
        // Use mock data for now
        setBookings({
          upcoming: [
            {
              _id: "1",
              mentorId: {
                _id: "mentor_1",
                firstName: "Сараа",
                lastName: "Бат",
                image:
                  "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face",
                profession: "Программчлалын багш",
                rating: 4.8,
              },
              date: "2025-08-04",
              time: "10:00",
              status: "CONFIRMED",
              price: 50000,
              category: "Программчлал",
            },
            {
              _id: "2",
              mentorId: {
                _id: "mentor_2",
                firstName: "Бат",
                lastName: "Дорж",
                image:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
                profession: "Бизнес зөвлөгч",
                rating: 4.9,
              },
              date: "2025-08-05",
              time: "14:00",
              status: "PENDING",
              price: 75000,
              category: "Бизнес",
            },
          ],
          past: [
            {
              _id: "3",
              mentorId: {
                _id: "mentor_3",
                firstName: "Оюун",
                lastName: "Болд",
                image:
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
                profession: "Дизайнер",
                rating: 4.7,
              },
              date: "2025-07-28",
              time: "15:00",
              status: "COMPLETED",
              price: 60000,
              category: "Дизайн",
            },
          ],
        });
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      // Use mock data on error
      setBookings({
        upcoming: [
          {
            _id: "1",
            mentorId: {
              _id: "mentor_1",
              firstName: "Сараа",
              lastName: "Бат",
              image:
                "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face",
              profession: "Программчлалын багш",
              rating: 4.8,
            },
            date: "2025-08-04",
            time: "10:00",
            status: "CONFIRMED",
            price: 50000,
            category: "Программчлал",
          },
          {
            _id: "2",
            mentorId: {
              _id: "mentor_2",
              firstName: "Бат",
              lastName: "Дорж",
              image:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
              profession: "Бизнес зөвлөгч",
              rating: 4.9,
            },
            date: "2025-08-05",
            time: "14:00",
            status: "PENDING",
            price: 75000,
            category: "Бизнес",
          },
        ],
        past: [
          {
            _id: "3",
            mentorId: {
              _id: "mentor_3",
              firstName: "Оюун",
              lastName: "Болд",
              image:
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
              profession: "Дизайнер",
              rating: 4.7,
            },
            date: "2025-07-28",
            time: "15:00",
            status: "COMPLETED",
            price: 60000,
            category: "Дизайн",
          },
        ],
      });
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
    // Handle logout logic
    router.push("/student-login");
  };

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
        <div className="flex-1 px-6 pb-20 pt-6">
          <div className="max-w-6xl mx-auto">
            {/* Main Dashboard Panel */}
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-white/20 h-[650px] w-full">
              <div className="flex gap-8 h-full">
                {/* Left Sidebar */}
                <div className="w-72 flex flex-col h-full justify-between">
                  <div className="space-y-2">
                    <button
                      onClick={() => setActiveTab("upcoming")}
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

                  {/* Meetings Section */}
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-white text-lg font-semibold mb-4">
                      {activeTab === "upcoming"
                        ? "Таны товлосон уулзалтууд:"
                        : "Уулзалтын түүх:"}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto">
                      {(activeTab === "upcoming"
                        ? bookings?.upcoming
                        : bookings?.past
                      )?.map((booking) => (
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
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800/80 backdrop-blur-sm border-t border-white/20">
          <div className="flex justify-around items-center py-4 px-6">
            <button className="text-gray-400 hover:text-white transition-colors">
              Нүүр хуудас
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              Менторууд
            </button>
            <button className="text-white font-medium">Профайл</button>
            <button className="relative">
              <svg
                className="w-6 h-6 text-gray-400 hover:text-white transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-5 5v-5zM4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                />
              </svg>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </button>
          </div>
        </div>

        {/* Copyright Footer */}
        <div className="fixed bottom-2 left-6 text-xs text-white/60 z-30">
          <div>Copyright © 2025 Mentor Meet</div>
          <div>All rights reserved.</div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
