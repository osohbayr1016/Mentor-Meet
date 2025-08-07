"use client";

import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

type CalendarResponse = {
  calendarId?: string;
  _id?: string;
  message?: string;
};

const MentorCalendar = () => {
  const [selectedTimesByDate, setSelectedTimesByDate] = useState<
    Record<string, Set<string>>
  >({});
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [activeDatePosition, setActiveDatePosition] = useState<
    "top" | "bottom"
  >("top");
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedBookingDate, setSelectedBookingDate] = useState<string>("");
  const [selectedBookingTime, setSelectedBookingTime] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const week1Dates = [
    { day: "Да", date: "4" },
    { day: "Мя", date: "5" },
    { day: "Лх", date: "6" },
    { day: "Пү", date: "7" },
    { day: "Ба", date: "8" },
    { day: "Бя", date: "9" },
    { day: "Ня", date: "10" },
  ];

  const week2Dates = [
    { day: "Да", date: "11" },
    { day: "Мя", date: "12" },
    { day: "Лх", date: "13" },
    { day: "Пү", date: "14" },
    { day: "Ба", date: "15" },
    { day: "Бя", date: "16" },
    { day: "Ня", date: "17" },
  ];

  const timeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
  ];

  const handleDateClick = (date: string, position: "top" | "bottom") => {
    if (activeDate === date) {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveDate(null);
        setActiveDatePosition("top");
        setIsAnimating(false);
      }, 300);
    } else {
      setActiveDate(date);
      setActiveDatePosition(position);
    }
  };

  const handleTimeClick = async (date: string, time: string) => {
    if (!date) return;

    setSelectedBookingDate(`2025-08-${date.padStart(2, "0")}`);
    setSelectedBookingTime(time);

    const token = localStorage.getItem("mentorToken");
    if (!token) {
      alert("Токен олдсонгүй!");
      return;
    }

    const updated = { ...selectedTimesByDate };
    const timeSet = updated[date] || new Set<string>();
    timeSet.has(time) ? timeSet.delete(time) : timeSet.add(time);
    updated[date] = timeSet;
    setSelectedTimesByDate(updated);

    const availabilities = Object.entries(updated).map(([day, times]) => ({
      date: `2025-08-${day.padStart(2, "0")}`,
      times: Array.from(times),
    }));

    try {
      const res = await axios.post<CalendarResponse>(
        `http://localhost:8000/calendar`,
        { availabilities },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data?.calendarId) {
        localStorage.setItem("calendarId", res.data.calendarId);
      }
    } catch (err) {
      console.error("Хадгалах үед алдаа:", err);
    }
  };

  const handleContinue = () => {
    const hasSelections = Object.values(selectedTimesByDate).some(
      (set) => set.size > 0
    );
    hasSelections ? setShowSuccessModal(true) : setShowConfirmationModal(true);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

  const handleConfirmContinue = () => {
    setShowConfirmationModal(false);
    setShowSuccessModal(true);
  };

  return (
    <div className="relative w-full h-screen">
      <div className="absolute inset-0 bg-black/30 -z-10" />
      <Image
        src="https://images.unsplash.com/photo-1706074740295-d7a79c079562?q=80&w=2232&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="background image"
        fill
        className="absolute inset-0 -z-20 object-cover"
      />

      <div className="relative z-10 w-full h-full flex justify-center items-center">
        <div className="w-6/10 h-7/10 flex items-center justify-center">
          <div className="w-full h-full border-gray-400/50 border-1 backdrop-blur-md bg-black/20 flex flex-col items-center rounded-[20px]">
            <div className="h-[140px] flex flex-col items-center justify-between pt-[40px]">
              <div className="flex gap-3 pb-[30px]">
                <Image
                  src="/image709.png"
                  alt="Mentor Meet Logo"
                  width={29}
                  height={24}
                />
                <p className="font-[700] text-[22px] text-white">Mentor Meet</p>
              </div>
              <p className="font-[600] text-[20px] text-white text-center px-8">
                Та боломжит цагуудаа сонгоно уу...
              </p>
            </div>

            <div className="w-full h-full flex flex-col justify-center items-center px-8 overflow-y-auto">
              <div className="w-full max-w-[500px] flex flex-col gap-[20px] py-4">
                {[week1Dates, week2Dates].map((week, i) => (
                  <div key={i} className="flex flex-col gap-[20px]">
                    <p className="font-[500] text-[16px] text-white text-center">
                      {i === 0 ? "08/04 - 08/10" : "08/11 - 08/17"}
                    </p>
                    <div className="flex justify-between gap-[10px]">
                      {week.map(({ day, date }) => (
                        <button
                          key={date}
                          onClick={() =>
                            handleDateClick(date, i === 0 ? "top" : "bottom")
                          }
                          className={`flex flex-col items-center justify-center w-[50px] h-[50issenpx] rounded-full border-1 transition-colors ${
                            activeDate === date
                              ? "bg-white text-black border-white"
                              : selectedTimesByDate[date]?.size > 0
                              ? "border-green-500 text-white"
                              : "border-white text-white hover:bg-white/10"
                          }`}
                        >
                          <span className="text-[10px] font-medium">{day}</span>
                          <span className="text-[14px] font-semibold">
                            {date}
                          </span>
                        </button>
                      ))}
                    </div>

                    {activeDate && week.some((d) => d.date === activeDate) && (
                      <div
                        className={`overflow-hidden ${
                          isAnimating ? "animate-slideUp" : "animate-slideDown"
                        }`}
                      >
                        <div className="grid grid-cols-6 gap-2">
                          {timeSlots.map((time) => (
                            <div key={time} className="flex flex-col gap-1">
                              <button
                                onClick={() =>
                                  handleTimeClick(activeDate, time)
                                }
                                className={`px-3 py-2 rounded-lg border border-white transition-colors ${
                                  selectedTimesByDate[activeDate]?.has(time)
                                    ? "bg-white text-black"
                                    : "text-white hover:bg-white/10"
                                }`}
                              >
                                {time}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pb-[60px] flex w-full justify-center mt-8">
              <button
                className="bg-white text-black rounded-[40px] py-[8px] px-[50px] font-medium hover:bg-gray-100 transition-colors"
                onClick={handleContinue}
              >
                Үргэлжлүүлэх
              </button>
            </div>
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="w-6/10 h-7/10 flex items-center justify-center">
            <div className="w-full h-full border-gray-400/50 border-1 backdrop-blur-md bg-black/20 flex flex-col items-center justify-center rounded-[20px]">
              <div className="flex gap-3 mb-8">
                <Image
                  src="/image709.png"
                  alt="Mentor Meet Logo"
                  width={29}
                  height={24}
                />
                <p className="font-[700] text-[22px] text-white">Mentor Meet</p>
              </div>
              <div className="flex items-center gap-3 mb-12">
                <p className="font-[600] text-[24px] text-white text-center">
                  Ментор болсонд тань баяр хүргэе!
                </p>
                <span className="text-2xl">🌱</span>
              </div>
              <div className="flex justify-center">
                <Link href="/">
                  <button
                    className="bg-white text-black rounded-[40px] py-[8px] px-[50px] font-medium hover:bg-gray-100 transition-colors"
                    onClick={handleCloseSuccessModal}
                  >
                    Үргэлжлүүлэх
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="w-6/10 h-7/10 flex items-center justify-center">
            <div className="w-full h-full border-gray-400/50 border-1 backdrop-blur-md bg-black/20 flex flex-col items-center justify-center rounded-[20px]">
              <div className="flex gap-3 mb-8">
                <Image
                  src="/image709.png"
                  alt="Mentor Meet Logo"
                  width={29}
                  height={24}
                />
                <p className="font-[700] text-[22px] text-white">Mentor Meet</p>
              </div>
              <div className="mb-12">
                <p className="font-[600] text-[20px] text-white text-center px-8">
                  Та өдөр, цагаа сонгоогүй байна. Үргэлжлүүлэх үү?
                </p>
              </div>
              <div className="flex gap-4 items-center h-[120px] flex-col w-[150px]">
                <button
                  className="px-6 py-3 w-full bg-white text-black text-[16px] hover:bg-gray-300 cursor-pointer rounded-[40px] transition-colors"
                  onClick={handleCloseConfirmationModal}
                >
                  Буцах
                </button>
                <button
                  className="px-6 py-3 w-full bg-white text-black text-[16px] hover:bg-gray-300 cursor-pointer rounded-[40px] transition-colors"
                  onClick={handleConfirmContinue}
                >
                  Тийм
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-2 left-6 text-xs text-white/60 z-30">
        <div>Copyright © 2025 Mentor Meet</div>
        <div>All rights reserved.</div>
      </div>
    </div>
  );
};

export default MentorCalendar;
