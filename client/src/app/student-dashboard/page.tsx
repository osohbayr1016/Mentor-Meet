"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface MentorAvailability {
  mentorId: string;
  mentorName: string;
  mentorEmail: string;
  date: string;
  time: string;
  category: string;
  price: number;
  experience: string;
  rating: number;
  profession: string;
  image: string;
}

const StudentDashboard = () => {
  const [availableMentors, setAvailableMentors] = useState<
    MentorAvailability[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] =
    useState<string>("programming");

  // Fetch available mentors from API
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedCategory !== "all") {
          params.append("category", selectedCategory);
        }

        const response = await fetch(`/api/get-available-mentors?${params}`);
        const data = await response.json();

        if (data.success) {
          setAvailableMentors(data.mentors);
        } else {
          console.error("Failed to fetch mentors:", data.error);
        }
      } catch (error) {
        console.error("Error fetching mentors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, [selectedCategory]);

  const handleBookSession = (mentor: MentorAvailability) => {
    // TODO: Implement booking logic
    alert(
      `Уулзалт захиалсан: ${mentor.mentorName} - ${mentor.date} ${mentor.time}`
    );
  };

  const categories = [
    { id: "programming", name: "Программчлал ба Технологи" },
    { id: "law", name: "Хууль, эрх зүй" },
    { id: "health", name: "Эрүүл мэнд" },
    { id: "design", name: "График ба Дизайн" },
    { id: "sport", name: "Спорт" },
    { id: "business", name: "Бизнес" },
    { id: "finance", name: "Санхүү" },
  ];

  const filteredMentors = availableMentors.filter((mentor) => {
    const categoryMatch =
      selectedCategory === "all" ||
      mentor.category.toLowerCase().includes(selectedCategory);
    return categoryMatch;
  });

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
          <h1 className="text-2xl font-bold text-white">Менторууд</h1>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-gray-800"
                fill="currentColor"
                viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-white font-semibold">Mentor Meet</span>
          </div>
        </div>

        {/* Category Filter Bar */}
        <div className="px-6 mb-6">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === category.id
                    ? "bg-white text-black font-medium"
                    : "text-white border border-white/30 hover:bg-white/10"
                }`}>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-6 pb-20">
          <div className="max-w-6xl mx-auto">
            {/* Left Panel - Search and Filters */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Logo and Search */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-gray-800"
                        fill="currentColor"
                        viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-white font-semibold">
                      Mentor Meet
                    </span>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Хайх..."
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/50"
                    />
                    <svg
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Category List */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h3 className="text-white font-semibold mb-4">Ангилал</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedCategory === category.id
                            ? "bg-white/20 text-white"
                            : "text-white/70 hover:text-white hover:bg-white/10"
                        }`}>
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Panel - Mentor Cards */}
              <div className="lg:col-span-3">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Менторуудтайгаа танилцана уу!
                </h2>

                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-white">Уншиж байна...</div>
                  </div>
                ) : filteredMentors.length === 0 ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-white text-center">
                      <p className="text-lg mb-2">Боломжит ментор олдсонгүй</p>
                      <p className="text-sm text-white/70">
                        Дараа дахин шалгана уу
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredMentors.map((mentor) => (
                      <div
                        key={mentor.mentorId}
                        className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-16 h-16 bg-gray-300 rounded-full overflow-hidden flex-shrink-0">
                            <Image
                              src={
                                mentor.image || "https://via.placeholder.com/64"
                              }
                              alt={mentor.mentorName}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-semibold text-lg mb-1">
                              {mentor.mentorName}
                            </h3>
                            <p className="text-white/70 text-sm mb-2">
                              {mentor.profession}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-white/80">
                                Туршлага: {mentor.experience}
                              </span>
                              <div className="flex items-center gap-1">
                                <svg
                                  className="w-4 h-4 text-yellow-400"
                                  fill="currentColor"
                                  viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="text-white">
                                  {mentor.rating}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="text-white/80 text-sm">
                            <p>Огноо: {mentor.date}</p>
                            <p>Цаг: {mentor.time}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-semibold text-lg">
                              {mentor.price.toLocaleString()}₮
                            </p>
                            <p className="text-white/70 text-sm">цаг</p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleBookSession(mentor)}
                          className="w-full mt-4 bg-white text-black px-4 py-3 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors">
                          Захиалах
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
