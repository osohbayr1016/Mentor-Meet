"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Star, ArrowLeft } from "lucide-react";
import MentorCalendar from "../../../components/MentorCalendar";
import BookingModal from "../../../components/BookingModal";

interface Mentor {
  id: string;
  firstName: string;
  lastName: string;
  profession: string;
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
  bio: string;
  rating: number;
  hourlyPrice: number;
  image: string;
  category?: {
    categoryId: string;
    price: number;
  };
}

const MentorDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const mentorId = params.id as string;

  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("4");
  const [selectedTimesByDate, setSelectedTimesByDate] = useState<
    Record<string, string[]>
  >({});
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedBookingDate, setSelectedBookingDate] = useState<string>("");
  const [selectedBookingTime, setSelectedBookingTime] = useState<string>("");
  const [totalPrice, setTotalPrice] = useState<number>(0);

  // Fetch mentor data from API
  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const response = await fetch(`/api/get-mentor/${mentorId}`);
        if (response.ok) {
          const mentorData = await response.json();
          setMentor(mentorData);
        } else {
          console.error("Failed to fetch mentor");
          // Fallback to mock data for development
          const mockMentor: Mentor = {
            id: mentorId || "1",
            firstName: "Энхжин",
            lastName: "Ч.",
            profession: "Эмч, Нийгмийн эрүүл мэндийн судлаач",
            experience: {
              work: "АШУҮИС",
              position: "Эмч",
              careerDuration: "8 жил",
            },
            education: {
              schoolName: "АШУҮИС",
              major: "Эрүүл мэнд",
              endedYear: "2020",
            },
            bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
            rating: 4.9,
            hourlyPrice: 20000,
            image:
              "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
          };
          setMentor(mockMentor);
        }
      } catch (error) {
        console.error("Error fetching mentor:", error);
      }
    };

    if (mentorId) {
      fetchMentor();
    }
  }, [mentorId]);

  const handleTimeSelect = (date: string, time: string) => {
    setSelectedDate(date);

    // Get current selected times for this date
    const currentTimesForDate = selectedTimesByDate[date] || [];

    // Toggle the selected time for this specific date
    const newTimesForDate = currentTimesForDate.includes(time)
      ? currentTimesForDate.filter((t) => t !== time)
      : [...currentTimesForDate, time];

    // Update the selected times for this date
    setSelectedTimesByDate((prev) => ({
      ...prev,
      [date]: newTimesForDate,
    }));
  };

  // Calculate total price whenever selectedTimesByDate or mentor changes
  useEffect(() => {
    if (mentor) {
      const allSelectedTimes = Object.values(selectedTimesByDate).flat();
      const totalHours = allSelectedTimes.length;
      const calculatedPrice = totalHours * mentor.hourlyPrice;
      setTotalPrice(calculatedPrice);
    }
  }, [selectedTimesByDate, mentor]);

  const handleBooking = (date: string, time: string) => {
    setSelectedBookingDate(date);
    setSelectedBookingTime(time);
    setShowBookingModal(true);
  };

  // Get total selected hours across all dates
  const getTotalSelectedHours = () => {
    return Object.values(selectedTimesByDate).flat().length;
  };

  // Get all selected times for display
  const getAllSelectedTimes = () => {
    return Object.values(selectedTimesByDate).flat();
  };

  if (!mentor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-8 h-8 border border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p>Уншиж байна...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      {/* Background image */}
      <div className="absolute inset-0 bg-black/30 -z-10" />
      <Image
        src="https://images.unsplash.com/photo-1706074740295-d7a79c079562?q=80&w=2232&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="background image"
        fill
        className="absolute inset-0 -z-20 object-cover"
      />

      {/* Main Content */}
      <div className="relative z-10 w-full h-full flex justify-center items-center p-6">
        <div className="w-full max-w-5xl h-[70vh] flex items-center justify-center">
          <div className="w-full h-full border-gray-400/50 border backdrop-blur-md bg-black/20 flex rounded-[20px] overflow-hidden">
            {/* Left Section - Mentor Profile */}
            <div className="w-1/3 p-5 flex flex-col">
              {/* Back Button */}
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-white mb-3 hover:text-gray-300 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Буцах</span>
              </button>

              {/* Mentor Profile */}
              <div className="flex flex-col items-center text-center mt-2">
                {/* Profile Picture */}
                <div className="w-18 h-18 rounded-full overflow-hidden mb-2">
                  <Image
                    src={mentor.image}
                    alt={mentor.firstName}
                    width={72}
                    height={72}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Mentor Name */}
                <h2 className="text-white text-base font-semibold mb-0.5">
                  {mentor.firstName} {mentor.lastName}
                </h2>

                {/* Profession */}
                <p className="text-gray-300 text-xs mb-0.5">
                  {mentor.profession}
                </p>

                {/* Field */}
                <p className="text-gray-400 text-xs mb-1">
                  Салбар: {mentor.education?.major || "Тодорхойгүй"}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-white text-xs font-medium">
                    {mentor.rating}
                  </span>
                </div>

                {/* Book Session Button */}
                <button
                  onClick={() => {
                    if (getTotalSelectedHours() > 0) {
                      setSelectedBookingDate(selectedDate);
                      setSelectedBookingTime(getAllSelectedTimes()[0]);
                      setShowBookingModal(true);
                    }
                  }}
                  disabled={getTotalSelectedHours() === 0}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                  Захиалга хийх ({getTotalSelectedHours()} цаг)
                </button>
              </div>
            </div>

            {/* Right Section - Mentor Details and Calendar */}
            <div className="w-2/3 p-5 flex flex-col">
              <div className="flex-1 flex flex-col gap-3">
                {/* Mentor Details */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-white/10 rounded-lg p-2.5">
                    <h3 className="text-white font-medium mb-1 text-sm">
                      Туршлага
                    </h3>
                    <p className="text-gray-300 text-xs">
                      {mentor.experience?.careerDuration || "Тодорхойгүй"}
                    </p>
                  </div>

                  <div className="bg-white/10 rounded-lg p-2.5">
                    <h3 className="text-white font-medium mb-1 text-sm">
                      Төгссөн сургууль
                    </h3>
                    <p className="text-gray-300 text-xs">
                      {mentor.education?.schoolName || "Тодорхойгүй"}
                    </p>
                  </div>
                </div>

                {/* Bio */}
                <div className="bg-white/10 rounded-lg p-2.5 mb-3">
                  <h3 className="text-white font-medium mb-1 text-sm">
                    Танилцуулга
                  </h3>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    {mentor.bio}
                  </p>
                </div>

                {/* Calendar Section */}
                <div className="flex-1">
                  <MentorCalendar
                    mentorId={mentor.id}
                    onTimeSelect={handleTimeSelect}
                    selectedTimesByDate={selectedTimesByDate}
                  />
                </div>

                {/* Price */}
                <div className="bg-white/10 rounded-lg p-2.5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium text-sm">
                      Цагийн үнэ:
                    </span>
                    <span className="text-white font-semibold text-base">
                      {mentor.hourlyPrice.toLocaleString()}₮
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium text-sm">
                      Уулзатын үнэ ({getTotalSelectedHours()} цаг):
                    </span>
                    <span className="text-white font-semibold text-base">
                      {totalPrice.toLocaleString()}₮
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-3 left-1/2 transform -translate-x-1/2 z-30">
        <div className="bg-black/20 backdrop-blur-md rounded-full px-4 py-2 flex gap-4">
          <button className="text-white text-xs hover:text-gray-300 transition-colors">
            Нүүр хуудас
          </button>
          <button className="text-white text-xs bg-white/20 px-2 py-0.5 rounded-full transition-colors">
            Менторууд
          </button>
          <button className="text-white text-xs hover:text-gray-300 transition-colors">
            Нэвтрэх
          </button>
        </div>
      </div>

      {/* Copyright Footer */}
      <div className="fixed bottom-2 left-6 text-xs text-white/60 z-30">
        <div>Copyright © 2025 Mentor Meet All rights reserved.</div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        selectedDate={selectedBookingDate}
        selectedTime={selectedBookingTime}
        totalPrice={totalPrice}
        selectedTimes={getAllSelectedTimes()}
        selectedTimesByDate={selectedTimesByDate}
      />
    </div>
  );
};

export default MentorDetailPage;
