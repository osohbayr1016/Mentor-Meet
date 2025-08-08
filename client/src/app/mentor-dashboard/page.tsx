"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { format } from "date-fns";

import { useAuth } from "../_components/MentorUserProvider";
import SidebarNavigation from "../_components/SidebarNavigation";
import ProfileView from "../_components/ProfileView";
import MeetingList from "../_components/MeetingList";

import {
  EditFormType,
  MentorProfile,
  Meeting,
  MeetingStatus,
} from "@/app/types/mentor";
import { useMentorBookings } from "../hooks/useMentorBookings";

export default function MentorDashboard() {
  const { mentor, isLoading, logout } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<
    "profile" | "scheduled" | "history"
  >("profile");
  const [mentorProfile, setMentorProfile] = useState<MentorProfile | null>(
    null
  );
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<EditFormType>({
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

  const [totalIncome] = useState(20000);

  const { bookings: fetchedBookings, loading: meetingsLoading } =
    useMentorBookings(mentor?.mentorId || "");
  const [bookings, setBookings] = useState<Meeting[]>([]);

  useEffect(() => {
    if (fetchedBookings.length > 0) {
      const converted: Meeting[] = fetchedBookings.map((b) => {
        const dateObj = new Date(b.date);
        const day = format(dateObj, "EEEE");
        return {
          id: b.id,
          date: b.date,
          day,
          time: b.time,
          studentEmail: b.studentEmail,
          status: b.status as MeetingStatus,
        };
      });
      setBookings(converted);
    }
  }, [fetchedBookings]);

  useEffect(() => {
    if (!isLoading && !mentor) {
      router.push("/");
    }
  }, [mentor, isLoading, router]);

  useEffect(() => {
    const fetchMentorProfile = async () => {
      if (!mentor?.mentorId) return;
      setProfileLoading(true);
      try {
        const token = localStorage.getItem("mentorToken");
        const res = await axios.get<{ mentor: MentorProfile }>(
          "http://localhost:8000/mentorProfile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = res.data.mentor;
        setMentorProfile(data);
        setEditForm({
          firstName: data.firstName,
          lastName: data.lastName,
          nickName: data.nickName || "",
          hourlyPrice: data.category?.price || 0,
          bio: data.bio,
          profession: data.profession,
          image: data.image,
          experience: { ...data.experience },
          education: { ...data.education },
        });
      } catch (error: any) {
        console.error("❌ Профайл ачааллах алдаа:", error);
        setProfileError(
          error?.response?.data?.message || "Профайл ачаалахад алдаа гарлаа"
        );
      } finally {
        setProfileLoading(false);
      }
    };
    fetchMentorProfile();
  }, [mentor?.mentorId]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditForm((prev) => ({ ...prev, image: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!mentor?.mentorId) return;
    const requiredFields = [];
    if (!editForm.firstName.trim()) requiredFields.push("Нэр");
    if (!editForm.lastName.trim()) requiredFields.push("Овог");
    if (!editForm.profession.trim()) requiredFields.push("Мэргэжил");

    if (requiredFields.length > 0) {
      alert(`Дараах талбарууд дутуу байна: ${requiredFields.join(", ")}`);
      return;
    }

    try {
      const token = localStorage.getItem("mentorToken");
      const res = await axios.put<{ mentor: MentorProfile }>(
        "http://localhost:8000/mentorEditProfile",
        {
          firstName: editForm.firstName,
          lastName: editForm.lastName,
          nickName: editForm.nickName,
          bio: editForm.bio,
          profession: editForm.profession,
          hourlyPrice: editForm.hourlyPrice,
          image: editForm.image,
          experience: { ...editForm.experience },
          education: { ...editForm.education },
          ...(mentorProfile?.category?.categoryId && {
            category: {
              categoryId: mentorProfile.category.categoryId,
              price: editForm.hourlyPrice,
            },
          }),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMentorProfile(res.data.mentor);
      setIsEditing(false);
      alert("Профайл амжилттай шинэчлэгдлээ!");
    } catch (err: any) {
      console.error("❌ Профайл шинэчлэх алдаа:", err);
      alert(err?.response?.data?.message || "Профайл шинэчлэхэд алдаа гарлаа");
    }
  };

  const handleCancelEdit = () => {
    if (mentorProfile) {
      setEditForm({
        firstName: mentorProfile.firstName,
        lastName: mentorProfile.lastName,
        nickName: mentorProfile.nickName || "",
        hourlyPrice: mentorProfile.category?.price || 0,
        bio: mentorProfile.bio,
        profession: mentorProfile.profession,
        image: mentorProfile.image,
        experience: { ...mentorProfile.experience },
        education: { ...mentorProfile.education },
      });
    }
    setIsEditing(false);
  };

  const handleCancelMeeting = async (meetingId: string) => {
    try {
      console.log("🚀 Цуцлах гэж байгаа уулзалтын ID:", meetingId);

      const token = localStorage.getItem("mentorToken");
      console.log("🔑 LocalStorage-с авсан токен:", token);

      const response = await axios.patch(
        `http://localhost:8000/bookings/${meetingId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      console.log("✅ PATCH /cancel response:", response.data);

      alert("Уулзалт амжилттай цуцлагдлаа!");

      const updated = bookings.map((m) =>
        m.id === meetingId ? { ...m, status: "cancelled" as MeetingStatus } : m
      );
      console.log("📦 Шинэчилсэн bookings:", updated);
      setBookings(updated);
    } catch (err: any) {
      console.error("❌ Уулзалт цуцлах алдаа:", err);
      console.log("📛 Алдаа дэлгэрэнгүй:", {
        status: err?.response?.status,
        message: err?.response?.data?.message,
        fullError: err,
      });
      alert(err?.response?.data?.message || "Уулзалт цуцлахад алдаа гарлаа");
    }
  };

  if (isLoading)
    return (
      <div className="text-white h-screen flex items-center justify-center">
        Уншиж байна...
      </div>
    );
  if (!mentor) return null;

  return (
    <div className="relative w-full min-h-screen">
      <div className="absolute inset-0 bg-black/30 -z-10" />
      <Image
        src="https://images.unsplash.com/photo-1706074740295-d7a79c079562?q=80&w=2232&auto=format&fit=crop"
        alt="bg"
        fill
        className="object-cover -z-20"
        priority
      />

      <div className="relative z-10 h-screen flex flex-col">
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="w-full max-w-6xl bg-black/20 backdrop-blur-sm p-8 border border-white/20 rounded-2xl h-[650px]">
            <div className="flex h-full gap-8">
              <SidebarNavigation
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onLogout={logout}
              />
              <div className="flex-1 overflow-y-auto">
                {activeTab === "profile" ? (
                  <ProfileView
                    mentorProfile={mentorProfile}
                    editForm={editForm}
                    isEditing={isEditing}
                    setEditForm={setEditForm}
                    setIsEditing={setIsEditing}
                    onSave={handleSaveProfile}
                    onCancel={handleCancelEdit}
                    onImageUpload={handleImageUpload}
                    loading={profileLoading}
                    error={profileError}
                  />
                ) : meetingsLoading ? (
                  <div className="text-white">
                    Уулзалтын мэдээлэл ачааллаж байна...
                  </div>
                ) : (
                  <>
                    <div className="mb-6">
                      <p className="text-sm text-gray-300">Таны нийт орлого:</p>
                      <p className="text-2xl font-bold text-green-400">
                        ₮{totalIncome.toLocaleString()}
                      </p>
                    </div>
                    <MeetingList
                      meetings={bookings.filter((m) =>
                        activeTab === "scheduled"
                          ? m.status === "scheduled"
                          : m.status === "completed" || m.status === "cancelled"
                      )}
                      activeTab={activeTab}
                      onJoinMeeting={(id) => console.log("join", id)}
                      onCancelMeeting={handleCancelMeeting}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-20 left-6 text-xs text-white/60 z-30">
          <div>© 2025 Mentor Meet</div>
          <div>All rights reserved.</div>
        </div>
      </div>
    </div>
  );
}
