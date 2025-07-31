"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import BookingModal from "./BookingModal";

interface MentorCalendarProps {
  mentorId?: string;
  onTimeSelect?: (date: string, time: string) => void;
  selectedTimesByDate?: Record<string, string[]>;
}

const MentorCalendar: React.FC<MentorCalendarProps> = ({
  mentorId,
  onTimeSelect,
  selectedTimesByDate = {},
}) => {
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
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
    // Call the onTimeSelect callback if provided
    if (onTimeSelect) {
      onTimeSelect(date, time);
    }
  };

  return (
    <div className="w-full">
      <div className="w-full flex flex-col gap-[15px]">
        {/* Week 1 */}
        <div className="flex flex-col gap-[15px]">
          <p className="font-[500] text-[14px] text-white text-center">
            08/04 - 08/10
          </p>
          <div className="flex justify-between gap-[8px]">
            {week1Dates.map((item) => (
              <button
                key={item.date}
                onClick={() => handleDateClick(item.date, "top")}
                className={`flex flex-col items-center justify-center w-[45px] h-[45px] rounded-full border-1 transition-colors ${
                  activeDate === item.date
                    ? "bg-white text-black border-white"
                    : selectedTimesByDate[item.date]?.length > 0
                    ? "border-green-500 text-white"
                    : "border-white text-white hover:bg-white/10"
                }`}
              >
                <span className="text-[9px] font-medium">{item.day}</span>
                <span className="text-[12px] font-semibold">{item.date}</span>
              </button>
            ))}
          </div>

          {/* Time slots for Week 1 */}
          {((activeDate && activeDatePosition === "top") ||
            (isAnimating && animatingDate && animatingPosition === "top")) && (
            <div
              className={`overflow-hidden ${
                isAnimating && animatingDate && animatingPosition === "top"
                  ? "animate-slideUp"
                  : "animate-slideDown"
              }`}
            >
              <div className="grid grid-cols-6 gap-1.5">
                {timeSlots.map((time) => (
                  <div key={time} className="flex flex-col gap-1">
                    <button
                      onClick={() =>
                        handleTimeClick(time, activeDate || animatingDate || "")
                      }
                      className={`px-2 py-1.5 rounded-lg border border-white transition-colors text-xs ${
                        selectedTimesByDate[
                          activeDate || animatingDate || ""
                        ]?.includes(time)
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
        <div className="flex flex-col gap-[15px]">
          <p className="font-[500] text-[14px] text-white text-center">
            08/11 - 08/17
          </p>
          <div className="flex justify-between gap-[8px]">
            {week2Dates.map((item) => (
              <button
                key={item.date}
                onClick={() => handleDateClick(item.date, "bottom")}
                className={`flex flex-col items-center justify-center w-[45px] h-[45px] rounded-full border-1 transition-colors ${
                  activeDate === item.date
                    ? "bg-white text-black border-white"
                    : selectedTimesByDate[item.date]?.length > 0
                    ? "border-green-500 text-white"
                    : "border-white text-white hover:bg-white/10"
                }`}
              >
                <span className="text-[9px] font-medium">{item.day}</span>
                <span className="text-[12px] font-semibold">{item.date}</span>
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
                isAnimating && animatingDate && animatingPosition === "bottom"
                  ? "animate-slideUp"
                  : "animate-slideDown"
              }`}
            >
              <div className="grid grid-cols-6 gap-1.5 ">
                {timeSlots.map((time) => (
                  <div key={time} className="flex flex-col gap-1">
                    <button
                      onClick={() =>
                        handleTimeClick(time, activeDate || animatingDate || "")
                      }
                      className={`px-2 py-1.5 rounded-lg border border-white transition-colors text-xs ${
                        selectedTimesByDate[
                          activeDate || animatingDate || ""
                        ]?.includes(time)
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
  );
};

export default MentorCalendar;
