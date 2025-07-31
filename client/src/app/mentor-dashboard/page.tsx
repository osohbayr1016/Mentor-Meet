"use client";

import { useAuth } from "../_Components/MentorUserProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const MentorDashboard = () => {
  const { mentor, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !mentor) {
      router.push("/mentor-login");
    }
  }, [mentor, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-8 h-8 border border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p>Уншиж байна...</p>
        </div>
      </div>
    );
  }

  if (!mentor) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Ментор удирдлага
            </h1>
            <p className="text-white/80">
              Сайн байна уу, {mentor.firstName} {mentor.lastName}!
            </p>
          </div>

          {/* Dashboard Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-white font-semibold text-lg mb-4">Профайл</h3>
              <div className="space-y-2 text-white/80">
                <p>Мэргэжил: {mentor.profession || "Тодорхойгүй"}</p>
                <p>Туршлага: {mentor.careerDuration || "Тодорхойгүй"}</p>
                <p>Имэйл: {mentor.email}</p>
              </div>
            </div>

            {/* Calendar Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-white font-semibold text-lg mb-4">Хуваарь</h3>
              <p className="text-white/80 mb-4">
                Таны цагийн хуваарийг удирдах
              </p>
              <button
                onClick={() => router.push("/mentor-calendar")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Хуваарь харах
              </button>
            </div>

            {/* Statistics Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-white font-semibold text-lg mb-4">
                Статистик
              </h3>
              <div className="space-y-2 text-white/80">
                <p>Нийт суралцагч: 0</p>
                <p>Энэ сарын орлого: 0₮</p>
                <p>Дундаж үнэлгээ: 0.0</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
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
  );
};

export default MentorDashboard;
