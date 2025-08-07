"use client";

import { useAuth } from "../_components/MentorUserProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import MeetingCard from "../../components/MeetingCard";
import axios from "axios";

interface MentorProfile {
  id: string;
  firstName: string;
  lastName: string;
  nickName?: string;
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
  email: string;
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
  const [activeTab, setActiveTab] = useState<
    "profile" | "scheduled" | "history"
  >("profile");
  const [totalIncome] = useState(20000); // Mock data
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    nickName: "",
    hourlyPrice: 0,
    bio: "",
    profession: "",
    image: "",
    experience: {
      work: "",
      position: "",
      careerDuration: "",
    },
    education: {
      schoolName: "",
      major: "",
      endedYear: "",
    },
  });

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
        const token = localStorage.getItem("mentorToken");
        const response = await axios.get<{ mentor: MentorProfile }>(
          `http://localhost:8000/mentorProfile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;
        setMentorProfile(data.mentor);
        setEditForm({
          firstName: data.mentor.firstName || "",
          lastName: data.mentor.lastName || "",
          nickName: data.mentor.nickName || "",
          hourlyPrice: data.mentor.category?.price || 0,
          bio: data.mentor.bio || "",
          profession: data.mentor.profession || "",
          image: data.mentor.image || "",
          experience: {
            work: data.mentor.experience?.work || "",
            position: data.mentor.experience?.position || "",
            careerDuration: data.mentor.experience?.careerDuration || "",
          },
          education: {
            schoolName: data.mentor.education?.schoolName || "",
            major: data.mentor.education?.major || "",
            endedYear: data.mentor.education?.endedYear || "",
          },
        });
      } catch (error: any) {
        console.error("Error fetching mentor profile:", error);
        setProfileError(
          error.response?.data?.message ||
            "Профайл мэдээлэл ачаалахад алдаа гарлаа"
        );
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

  const handleSaveProfile = async () => {
    if (!mentor?.mentorId) return;

    // Frontend validation
    const requiredFields = [];
    if (!editForm.firstName?.trim()) requiredFields.push("Нэр");
    if (!editForm.lastName?.trim()) requiredFields.push("Овог");
    if (!editForm.profession?.trim()) requiredFields.push("Мэргэжил");

    if (requiredFields.length > 0) {
      alert(
        `Заавал бөглөх талбарууд дутуу байна: ${requiredFields.join(", ")}`
      );
      return;
    }

    try {
      const token = localStorage.getItem("mentorToken");

      const requestData = {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        nickName: editForm.nickName,
        bio: editForm.bio,
        profession: editForm.profession,
        hourlyPrice: editForm.hourlyPrice,
        image: editForm.image,
        experience: {
          work: editForm.experience.work,
          position: editForm.experience.position,
          careerDuration: editForm.experience.careerDuration,
        },
        education: {
          schoolName: editForm.education.schoolName,
          major: editForm.education.major,
          endedYear: editForm.education.endedYear,
        },
        ...(mentorProfile?.category?.categoryId && {
          category: {
            categoryId: mentorProfile.category.categoryId,
            price: editForm.hourlyPrice,
          },
        }),
      };

      console.log("Sending profile update data:", requestData);

      const response = await axios.put<{ mentor: MentorProfile }>(
        `http://localhost:8000/mentorEditProfile`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedProfile = response.data;
      console.log("Updated profile response:", updatedProfile);
      console.log("Updated mentor data:", updatedProfile.mentor);
      setMentorProfile(updatedProfile.mentor);
      setIsEditing(false);
      alert("Профайл амжилттай шинэчлэгдлээ!");

      // Refresh the profile data to ensure consistency
      setTimeout(() => {
        const fetchMentorProfile = async () => {
          try {
            const token = localStorage.getItem("mentorToken");
            const response = await axios.get<{ mentor: MentorProfile }>(
              `http://localhost:8000/mentorProfile`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            const data = response.data;
            setMentorProfile(data.mentor);
          } catch (error: any) {
            console.error("Error refreshing profile:", error);
          }
        };
        fetchMentorProfile();
      }, 1000);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      alert(error.response?.data?.message || "Профайл шинэчлэхэд алдаа гарлаа");
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setEditForm((prev) => ({
          ...prev,
          image: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancelEdit = () => {
    if (mentorProfile) {
      setEditForm({
        firstName: mentorProfile.firstName || "",
        lastName: mentorProfile.lastName || "",
        nickName: mentorProfile.nickName || "",
        hourlyPrice: mentorProfile.category?.price || 0,
        bio: mentorProfile.bio || "",
        profession: mentorProfile.profession || "",
        image: mentorProfile.image || "",
        experience: {
          work: mentorProfile.experience?.work || "",
          position: mentorProfile.experience?.position || "",
          careerDuration: mentorProfile.experience?.careerDuration || "",
        },
        education: {
          schoolName: mentorProfile.education?.schoolName || "",
          major: mentorProfile.education?.major || "",
          endedYear: mentorProfile.education?.endedYear || "",
        },
      });
    }
    setIsEditing(false);
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
          <div className="w-full max-w-6xl">
            {/* Main Dashboard Panel */}
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-white/20 h-[650px] w-full">
              <div className="flex gap-8 h-full">
                {/* Left Sidebar */}
                <div className="w-72 flex flex-col h-full justify-between">
                  <div className="space-y-2">
                    <button
                      onClick={() => setActiveTab("profile")}
                      className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors ${
                        activeTab === "profile"
                          ? "bg-gray-600 text-white"
                          : "text-gray-300 hover:bg-gray-700/50"
                      }`}
                    >
                      Миний профайл
                    </button>
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
                      onClick={() => router.push("/mentor-calendar")}
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
                  {activeTab === "profile" ? (
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-white text-lg font-semibold">
                          Миний профайл
                        </h3>
                        {!isEditing ? (
                          <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Засах
                          </button>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={handleSaveProfile}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Хадгалах
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                              Цуцлах
                            </button>
                          </div>
                        )}
                      </div>

                      {profileLoading ? (
                        <div className="text-white text-center py-8">
                          <div className="w-8 h-8 border border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                          <p>Профайл уншиж байна...</p>
                        </div>
                      ) : profileError ? (
                        <div className="text-red-400 text-center py-8">
                          {profileError}
                        </div>
                      ) : mentorProfile ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Profile Image and Basic Info */}
                          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                            <div className="flex items-center gap-4 mb-4">
                              <div className="relative">
                                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-600">
                                  {(
                                    isEditing
                                      ? editForm.image
                                      : mentorProfile.image
                                  ) ? (
                                    <Image
                                      src={
                                        isEditing
                                          ? editForm.image
                                          : mentorProfile.image
                                      }
                                      alt="Profile"
                                      width={80}
                                      height={80}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white text-2xl">
                                      {mentorProfile.firstName?.[0]}
                                      {mentorProfile.lastName?.[0]}
                                    </div>
                                  )}
                                </div>
                                {isEditing && (
                                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 cursor-pointer hover:bg-blue-700 transition-colors">
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
                                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                      />
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                      />
                                    </svg>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={handleImageUpload}
                                      className="hidden"
                                    />
                                  </label>
                                )}
                              </div>
                              <div>
                                {isEditing ? (
                                  <div className="space-y-2">
                                    <input
                                      type="text"
                                      value={editForm.firstName}
                                      onChange={(e) =>
                                        setEditForm((prev) => ({
                                          ...prev,
                                          firstName: e.target.value,
                                        }))
                                      }
                                      placeholder="Нэр"
                                      className="w-full px-3 py-1 bg-white/20 border border-white/30 rounded text-white placeholder-gray-300"
                                    />
                                    <input
                                      type="text"
                                      value={editForm.lastName}
                                      onChange={(e) =>
                                        setEditForm((prev) => ({
                                          ...prev,
                                          lastName: e.target.value,
                                        }))
                                      }
                                      placeholder="Овог"
                                      className="w-full px-3 py-1 bg-white/20 border border-white/30 rounded text-white placeholder-gray-300"
                                    />
                                    <input
                                      type="text"
                                      value={editForm.nickName}
                                      onChange={(e) =>
                                        setEditForm((prev) => ({
                                          ...prev,
                                          nickName: e.target.value,
                                        }))
                                      }
                                      placeholder="Nickname"
                                      className="w-full px-3 py-1 bg-white/20 border border-white/30 rounded text-white placeholder-gray-300"
                                    />
                                  </div>
                                ) : (
                                  <div>
                                    <h4 className="text-white text-xl font-semibold">
                                      {mentorProfile.firstName}{" "}
                                      {mentorProfile.lastName}
                                    </h4>
                                    <p className="text-gray-300">
                                      {mentorProfile.nickName ||
                                        "Nickname оруулаагүй"}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div>
                                <label className="text-gray-300 text-sm">
                                  И-мэйл:
                                </label>
                                <p className="text-white">
                                  {mentorProfile.email}
                                </p>
                              </div>
                              <div>
                                <label className="text-gray-300 text-sm">
                                  Мэргэжил:
                                </label>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={editForm.profession}
                                    onChange={(e) =>
                                      setEditForm((prev) => ({
                                        ...prev,
                                        profession: e.target.value,
                                      }))
                                    }
                                    className="mt-1 w-full px-3 py-1 bg-white/20 border border-white/30 rounded text-white placeholder-gray-300"
                                  />
                                ) : (
                                  <p className="text-white">
                                    {mentorProfile.profession}
                                  </p>
                                )}
                              </div>
                              <div>
                                <label className="text-gray-300 text-sm">
                                  Цагийн үнэлгээ:
                                </label>
                                {isEditing ? (
                                  <input
                                    type="number"
                                    value={editForm.hourlyPrice}
                                    onChange={(e) =>
                                      setEditForm((prev) => ({
                                        ...prev,
                                        hourlyPrice:
                                          parseInt(e.target.value) || 0,
                                      }))
                                    }
                                    className="mt-1 w-full px-3 py-1 bg-white/20 border border-white/30 rounded text-white"
                                  />
                                ) : (
                                  <p className="text-white">
                                    ¥
                                    {mentorProfile.category?.price?.toLocaleString() ||
                                      0}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Bio and Additional Info */}
                          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                            <h5 className="text-white font-semibold mb-3">
                              Товч танилцуулга
                            </h5>
                            {isEditing ? (
                              <textarea
                                value={editForm.bio}
                                onChange={(e) =>
                                  setEditForm((prev) => ({
                                    ...prev,
                                    bio: e.target.value,
                                  }))
                                }
                                rows={4}
                                className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded text-white placeholder-gray-300 resize-none"
                                placeholder="Өөрийнхөө тухай товч танилцуулга бичнэ үү..."
                              />
                            ) : (
                              <p className="text-gray-300">
                                {mentorProfile.bio ||
                                  "Товч танилцуулга оруулаагүй"}
                              </p>
                            )}

                            <div className="mt-6 space-y-3">
                              <div>
                                <label className="text-gray-300 text-sm">
                                  Туршлага:
                                </label>
                                {isEditing ? (
                                  <div className="space-y-2">
                                    <input
                                      type="text"
                                      value={editForm.experience.work}
                                      onChange={(e) =>
                                        setEditForm((prev) => ({
                                          ...prev,
                                          experience: {
                                            ...prev.experience,
                                            work: e.target.value,
                                          },
                                        }))
                                      }
                                      placeholder="Ажилласан газар"
                                      className="mt-1 w-full px-3 py-1 bg-white/20 border border-white/30 rounded text-white placeholder-gray-300"
                                    />
                                    <input
                                      type="text"
                                      value={editForm.experience.position}
                                      onChange={(e) =>
                                        setEditForm((prev) => ({
                                          ...prev,
                                          experience: {
                                            ...prev.experience,
                                            position: e.target.value,
                                          },
                                        }))
                                      }
                                      placeholder="Албан тушаал"
                                      className="w-full px-3 py-1 bg-white/20 border border-white/30 rounded text-white placeholder-gray-300"
                                    />
                                    <input
                                      type="text"
                                      value={editForm.experience.careerDuration}
                                      onChange={(e) =>
                                        setEditForm((prev) => ({
                                          ...prev,
                                          experience: {
                                            ...prev.experience,
                                            careerDuration: e.target.value,
                                          },
                                        }))
                                      }
                                      placeholder="Ажилласан жил"
                                      className="w-full px-3 py-1 bg-white/20 border border-white/30 rounded text-white placeholder-gray-300"
                                    />
                                  </div>
                                ) : (
                                  <p className="text-white">
                                    {mentorProfile.experience?.careerDuration ||
                                      "Туршлага оруулаагүй"}
                                  </p>
                                )}
                              </div>
                              <div>
                                <label className="text-gray-300 text-sm">
                                  Боловсрол:
                                </label>
                                {isEditing ? (
                                  <div className="space-y-2">
                                    <input
                                      type="text"
                                      value={editForm.education.schoolName}
                                      onChange={(e) =>
                                        setEditForm((prev) => ({
                                          ...prev,
                                          education: {
                                            ...prev.education,
                                            schoolName: e.target.value,
                                          },
                                        }))
                                      }
                                      placeholder="Сургуулийн нэр"
                                      className="mt-1 w-full px-3 py-1 bg-white/20 border border-white/30 rounded text-white placeholder-gray-300"
                                    />
                                    <input
                                      type="text"
                                      value={editForm.education.major}
                                      onChange={(e) =>
                                        setEditForm((prev) => ({
                                          ...prev,
                                          education: {
                                            ...prev.education,
                                            major: e.target.value,
                                          },
                                        }))
                                      }
                                      placeholder="Мэргэжлийн нэр"
                                      className="w-full px-3 py-1 bg-white/20 border border-white/30 rounded text-white placeholder-gray-300"
                                    />
                                    <input
                                      type="text"
                                      value={editForm.education.endedYear}
                                      onChange={(e) =>
                                        setEditForm((prev) => ({
                                          ...prev,
                                          education: {
                                            ...prev.education,
                                            endedYear: e.target.value,
                                          },
                                        }))
                                      }
                                      placeholder="Төгссөн он"
                                      className="w-full px-3 py-1 bg-white/20 border border-white/30 rounded text-white placeholder-gray-300"
                                    />
                                  </div>
                                ) : (
                                  <p className="text-white">
                                    {mentorProfile.education?.schoolName} -{" "}
                                    {mentorProfile.education?.major}
                                  </p>
                                )}
                              </div>
                              <div>
                                <label className="text-gray-300 text-sm">
                                  Үнэлгээ:
                                </label>
                                <div className="flex items-center gap-2">
                                  <span className="text-yellow-400">★</span>
                                  <span className="text-white">
                                    {mentorProfile.rating || 0}/5
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-white text-center py-8">
                          Профайл мэдээлэл олдсонгүй
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Footer */}
        <div className="fixed bottom-20 left-6 text-xs text-white/60 z-30">
          <div>Copyright © 2025 Mentor Meet</div>
          <div>All rights reserved.</div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
