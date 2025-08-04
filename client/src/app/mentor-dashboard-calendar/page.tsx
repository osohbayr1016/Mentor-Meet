"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const MentorDashboardCalendar = () => {
  const router = useRouter();
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [selectedTimesByDate, setSelectedTimesByDate] = useState<
    Record<string, Set<string>>
  >({});
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [activeDatePosition, setActiveDatePosition] = useState<
    "top" | "bottom"
  >("top");
  const [isAnimating, setIsAnimating] = useState(false);
  const [animatingDate, setAnimatingDate] = useState<string | null>(null);
  const [animatingPosition, setAnimatingPosition] = useState<"top" | "bottom">(
    "top"
  );

  // Generate dates for two weeks starting from August 4th
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

  // Time slots from 09:00 to 20:00
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
      // Start slide-up animation
      setIsAnimating(true);
      setAnimatingDate(date);
      setAnimatingPosition(position);

      // After animation completes, hide the time slots
      setTimeout(() => {
        setActiveDate(null);
        setActiveDatePosition("top");
        setIsAnimating(false);
        setAnimatingDate(null);
      }, 300); // Match animation duration
    } else {
      setActiveDate(date);
      setActiveDatePosition(position);
    }
  };

  const handleTimeClick = (time: string, date: string) => {
    const currentDateTimes = selectedTimesByDate[date] || new Set();
    const newDateTimes = new Set(currentDateTimes);

    if (newDateTimes.has(time)) {
      newDateTimes.delete(time);
    } else {
      newDateTimes.add(time);
    }

    setSelectedTimesByDate((prev) => ({
      ...prev,
      [date]: newDateTimes,
    }));
  };

  const handleBackToDashboard = () => {
    router.push("/mentor-dashboard");
  };

  const handleSaveAvailability = () => {
    // This would contain the logic to save availability
    console.log("Saving availability:", selectedTimesByDate);
    router.push("/mentor-dashboard");
  };

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

      {/* Main Calendar Modal */}
      <div className="relative z-10 w-full h-full flex justify-center items-center">
        <div className="w-6/10 h-7/10 flex items-center justify-center">
          <div className="w-full h-full border-gray-400/50 border-1 backdrop-blur-md bg-black/20 flex flex-col items-center rounded-[20px]">
            {/* Header */}
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

            {/* Calendar Content */}
            <div className="w-full h-full flex flex-col justify-center items-center px-8">
              <div className="w-full max-w-[500px] flex flex-col gap-[20px]">
                {/* Week 1 */}
                <div className="flex flex-col gap-[20px]">
                  <p className="font-[500] text-[16px] text-white text-center">
                    08/04 - 08/10
                  </p>
                  <div className="flex justify-between gap-[10px]">
                    {week1Dates.map((item) => (
                      <button
                        key={item.date}
                        onClick={() => handleDateClick(item.date, "top")}
                        className={`flex flex-col items-center justify-center w-[50px] h-[50px] rounded-full border-1 transition-colors ${
                          activeDate === item.date
                            ? "bg-white text-black border-white"
                            : selectedTimesByDate[item.date]?.size > 0
                            ? "border-green-500 text-white"
                            : "border-white text-white hover:bg-white/10"
                        }`}
                      >
                        <span className="text-[10px] font-medium">
                          {item.day}
                        </span>
                        <span className="text-[14px] font-semibold">
                          {item.date}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Time slots for Week 1 */}
                  {((activeDate && activeDatePosition === "top") ||
                    (isAnimating &&
                      animatingDate &&
                      animatingPosition === "top")) && (
                    <div
                      className={`overflow-hidden ${
                        isAnimating &&
                        animatingDate &&
                        animatingPosition === "top"
                          ? "animate-slideUp"
                          : "animate-slideDown"
                      }`}
                    >
                      <div className="grid grid-cols-6 gap-2">
                        {timeSlots.map((time) => (
                          <div key={time} className="flex flex-col gap-1">
                            <button
                              onClick={() =>
                                handleTimeClick(
                                  time,
                                  activeDate || animatingDate || ""
                                )
                              }
                              className={`px-3 py-2 rounded-lg border border-white transition-colors ${
                                selectedTimesByDate[
                                  activeDate || animatingDate || ""
                                ]?.has(time)
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

                {/* Week 2 */}
                <div className="flex flex-col gap-[20px]">
                  <p className="font-[500] text-[16px] text-white text-center">
                    08/11 - 08/17
                  </p>
                  <div className="flex justify-between gap-[10px]">
                    {week2Dates.map((item) => (
                      <button
                        key={item.date}
                        onClick={() => handleDateClick(item.date, "bottom")}
                        className={`flex flex-col items-center justify-center w-[50px] h-[50px] rounded-full border-1 transition-colors ${
                          activeDate === item.date
                            ? "bg-white text-black border-white"
                            : selectedTimesByDate[item.date]?.size > 0
                            ? "border-green-500 text-white"
                            : "border-white text-white hover:bg-white/10"
                        }`}
                      >
                        <span className="text-[10px] font-medium">
                          {item.day}
                        </span>
                        <span className="text-[14px] font-semibold">
                          {item.date}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Time slots for Week 2 */}
                  {((activeDate && activeDatePosition === "bottom") ||
                    (isAnimating &&
                      animatingDate &&
                      animatingPosition === "bottom")) && (
                    <div
                      className={`overflow-hidden ${
                        isAnimating &&
                        animatingDate &&
                        animatingPosition === "bottom"
                          ? "animate-slideUp"
                          : "animate-slideDown"
                      }`}
                    >
                      <div className="grid grid-cols-6 gap-2 ">
                        {timeSlots.map((time) => (
                          <div key={time} className="flex flex-col gap-1">
                            <button
                              onClick={() =>
                                handleTimeClick(
                                  time,
                                  activeDate || animatingDate || ""
                                )
                              }
                              className={`px-3 py-2 rounded-lg border border-white transition-colors ${
                                selectedTimesByDate[
                                  activeDate || animatingDate || ""
                                ]?.has(time)
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
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pb-[60px] flex w-full justify-center mt-8 gap-4">
              <button
                className="bg-gray-600 text-white rounded-[40px] py-[8px] px-[30px] font-medium hover:bg-gray-700 transition-colors"
                onClick={handleBackToDashboard}
              >
                Буцах
              </button>
              <button
                className="bg-white text-black rounded-[40px] py-[8px] px-[50px] font-medium hover:bg-gray-100 transition-colors"
                onClick={handleSaveAvailability}
              >
                Хадгалах
              </button>
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
  );
};

export default MentorDashboardCalendar;
