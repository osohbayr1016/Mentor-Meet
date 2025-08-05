"use client";

import { useAuth } from "../_components/MentorUserProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import MeetingCard from "../../components/MeetingCard";


interface MentorProfile {
  id: string;
  firstName: string;
  lastName: string;
  profession: string;
  bio: string;
  image: string;
  rating: number;
  experience: {
    work: string;
    position: string;
    careerDuration: string;
  };
  education: {
    schoolName: string;
    major: string;
    endedYear: string;
  };
  category: {
    categoryId: string;
    price: number;
  };
  hourlyPrice: number;
}

interface Meeting {
  id: string;
  date: string;
  day: string;
  time: string;
  studentEmail: string;
  status: "scheduled" | "cancelled" | "completed";
}

const MentorDashboard = () => {
  const { mentor, isLoading, logout } = useAuth();
  const router = useRouter();
  const [mentorProfile, setMentorProfile] = useState<MentorProfile | null>(
    null
  );
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"scheduled" | "history">(
    "scheduled"
  );
  const [totalIncome] = useState(20000); // Mock data

  // Mock meeting data
  const [scheduledMeetings] = useState<Meeting[]>([
    {
      id: "1",
      date: "8 сарын 4",
      day: "Даваа гараг",
      time: "10:00",
      studentEmail: "maralguagurbadam@gmail.com",
      status: "scheduled",
    },
    {
      id: "2",
      date: "8 сарын 4",
      day: "Даваа гараг",
      time: "10:00",
      studentEmail: "maralguagurbadam@gmail.com",
      status: "cancelled",
    },
  ]);

  const [meetingHistory] = useState<Meeting[]>([
    {
      id: "3",
      date: "7 сарын 28",
      day: "Ням гараг",
      time: "15:00",
      studentEmail: "student3@gmail.com",
      status: "completed",
    },
    {
      id: "4",
      date: "7 сарын 25",
      day: "Пүрэв гараг",
      time: "11:00",
      studentEmail: "student4@gmail.com",
      status: "completed",
    },
  ]);

  useEffect(() => {
    if (!isLoading && !mentor) {
      router.push("/");
    }
  }, [mentor, isLoading, router]);

  useEffect(() => {
    const fetchMentorProfile = async () => {
      if (!mentor?.mentorId) return;

      setProfileLoading(true);
      setProfileError(null);

      try {
        const response = await fetch(`/api/get-mentor/${mentor.mentorId}`);
        const data = await response.json();

        if (response.ok) {
          setMentorProfile(data);
        } else {
          setProfileError(
            data.error || "Профайл мэдээлэл ачаалахад алдаа гарлаа"
          );
        }
      } catch (error) {
        console.error("Error fetching mentor profile:", error);
        setProfileError("Профайл мэдээлэл ачаалахад алдаа гарлаа");
      } finally {
        setProfileLoading(false);
      }
    };

    if (mentor?.mentorId) {
      fetchMentorProfile();
    }
  }, [mentor?.mentorId]);

  const handleLogout = () => {
    logout();
  };

  const handleJoinMeeting = (meetingId: string) => {
    // Handle join meeting logic
    console.log("Joining meeting:", meetingId);
  };

  const handleCancelMeeting = (meetingId: string) => {
    // Handle cancel meeting logic
    console.log("Cancelling meeting:", meetingId);
  };

  if (isLoading) {
    return (
      <div className="relative w-full h-screen">
        {/* Background image */}
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

  if (!mentor) {
    return null;
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
      <div className="relative z-10 w-full h-screen flex flex-col">
        {/* Main Content */}
        <div className="flex-1 px-6 pb-6 pt-6 flex items-center justify-center">
          <div className="w-full max-w-5xl">
            {/* Main Dashboard Panel */}
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-white/20 h-[650px] w-full ">
              <div className="flex gap-8 h-full ">
                {/* Left Sidebar */}
                <div className="w-72 flex flex-col h-full justify-between ">
                  <div className="space-y-2">
                    <button
                      onClick={() => setActiveTab("scheduled")}
                      className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors ${
                        activeTab === "scheduled"
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
                      onClick={() => router.push("/mentor-dashboard-calendar")}
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
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Календар засах
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
                      Таны нийт орлого:
                    </p>
                    <p className="text-green-400 text-2xl font-bold">
                      ¥{totalIncome.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-white text-lg font-semibold mb-4">
                      {activeTab === "scheduled"
                        ? "Таны товлосон уулзалтууд:"
                        : "Уулзалтын түүх:"}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                      {(activeTab === "scheduled"
                        ? scheduledMeetings
                        : meetingHistory
                      ).map((meeting) => (
                        <MeetingCard
                          key={meeting.id}
                          meeting={meeting}
                          onJoinMeeting={
                            activeTab === "scheduled"
                              ? handleJoinMeeting
                              : undefined
                          }
                          onCancelMeeting={
                            activeTab === "scheduled"
                              ? handleCancelMeeting
                              : undefined
                          }
                          showActions={activeTab === "scheduled"}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Meetings Section */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}

        {/* Copyright Footer */}
        <div className="fixed bottom-2 left-6 text-xs text-white/60 z-30">
          <div>Copyright © 2025 Mentor Meet</div>
          <div>All rights reserved.</div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
