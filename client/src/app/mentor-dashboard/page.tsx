"use client";

import { useAuth } from "../_components/MentorUserProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

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

const MentorDashboard = () => {
  const { mentor, isLoading, logout } = useAuth();
  const router = useRouter();
  const [mentorProfile, setMentorProfile] = useState<MentorProfile | null>(
    null
  );
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !mentor) {
      router.push("/mentor-login");
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
      <div className="relative z-10 w-full min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6">
          <h1 className="text-2xl font-bold text-white">Ментор удирдлага</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-gray-800"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-white font-semibold">Mentor Meet</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
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

        {/* Main Content */}
        <div className="flex-1 px-6 pb-20">
          <div className="max-w-6xl mx-auto">
            {/* Welcome Message */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Сайн байна уу, {mentor.firstName} {mentor.lastName}!
                </h2>
                <p className="text-white/80">Таны ментор удирдлагын самбар</p>
              </div>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {/* Profile Card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-white font-semibold text-lg mb-4">
                  Профайл
                </h3>
                {profileLoading ? (
                  <div className="text-white/80">
                    <div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin mb-2"></div>
                    <p>Профайл уншиж байна...</p>
                  </div>
                ) : profileError ? (
                  <div className="text-white/80">
                    <p className="text-red-300 mb-2">Алдаа: {profileError}</p>
                    <p>
                      Профайл мэдээлэл ачаалахад алдаа гарлаа. Дахин оролдоно
                      уу.
                    </p>
                  </div>
                ) : mentorProfile ? (
                  <div className="space-y-2 text-white/80">
                    <p>Мэргэжил: {mentorProfile.profession || "Тодорхойгүй"}</p>
                    <p>
                      Туршлага:{" "}
                      {mentorProfile.experience?.careerDuration ||
                        "Тодорхойгүй"}
                    </p>
                    <p>Имэйл: {mentor.email}</p>
                  </div>
                ) : (
                  <div className="text-white/80">
                    <p>Профайл мэдээлэл олдсонгүй</p>
                  </div>
                )}
              </div>

              {/* Calendar Card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-white font-semibold text-lg mb-4">
                  Хуваарь
                </h3>
                <p className="text-white/80 mb-4">
                  Таны цагийн хуваарийг удирдах
                </p>
                <button
                  onClick={() => router.push("/mentor-calendar")}
                  className="bg-white text-black px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  Хуваарь харах
                </button>
              </div>

              {/* Statistics Card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-white font-semibold text-lg mb-4">
                  Статистик
                </h3>
                <div className="space-y-2 text-white/80">
                  <p>Нийт суралцагч: 0</p>
                  <p>Энэ сарын орлого: 0₮</p>
                  <p>Дундаж үнэлгээ: {mentorProfile?.rating || 0}</p>
                  {mentorProfile?.hourlyPrice && (
                    <p>
                      Цагийн үнэ: {mentorProfile.hourlyPrice.toLocaleString()}₮
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-white font-semibold text-lg mb-4">
                Сүүлийн үйл ажиллагаа
              </h3>
              <div className="text-white/80">
                <p>Одоогоор үйл ажиллагаа байхгүй байна.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
