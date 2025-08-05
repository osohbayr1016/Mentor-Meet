"use client";

import { useEffect, useState } from "react";
import BookingModal from "./BookingModal";

interface MentorCalendarProps {
  mentorId?: string;
  onTimeSelect?: (date: string, time: string) => void;
  selectedTimesByDate?: Record<string, string[]>;
}

interface StudentProps {
  studentId?:string;
}

interface CalendarResponse {
  calendarId?: string;
  _id?: string;
  message?: string;
  [key: string]: any; 
}

const MentorCalendar: React.FC<MentorCalendarProps> = ({
  mentorId,
  onTimeSelect,
  selectedTimesByDate = {},
}) => {
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [activeDatePosition, setActiveDatePosition] = useState<
    "top" | "bottom"
  >("top");
  const [isAnimating, setIsAnimating] = useState(false);
  const [animatingDate, setAnimatingDate] = useState<string | null>(null);
  const [animatingPosition, setAnimatingPosition] = useState<"top" | "bottom">(
    "top"
  );

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
      setAnimatingDate(date);
      setAnimatingPosition(position);

      setTimeout(() => {
        setActiveDate(null);
        setIsAnimating(false);
        setAnimatingDate(null);
      }, 300);
    } else {
      setActiveDate(date);
      setActiveDatePosition(position);
    }
  };

  const handleTimeClick = async (time: string, date: string) => {

// const studentId = localStorage.getItem("studentUser")
// if(!studentId) return
  
//   const token = localStorage.getItem("studentToken")
// if(!token) return alert("Нэвтрэх шаардлагатай!")

   
    onTimeSelect?.(date, time);

    // шинэчилж сонгосон цагуудаа энэ дотор задалж бэлдээд байгаа юм уу даа.
  
    const newTimes = { ...selectedTimesByDate };
    const times = newTimes[date] || [];
    // асуух?
    const updatedTimes = times.includes(time)
      ? times.filter((t) => t !== time)
      : [...times, time];

    newTimes[date] = updatedTimes;

    const availabilities = Object.entries(newTimes).map(([date, times]) => ({

      date: `2025-08-${date.padStart(2, "0")}`,
      times,
    }));

    const token = localStorage.getItem("mentorToken")

    try {
      const res = await axios.post<CalendarResponse>(
        "http://localhost:8000/Calendar",
        { availabilities },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Амжилттай хадгаллаа:", res.data);
      const calendarId = res.data?.calendarId

      if(calendarId){
        localStorage.setItem(calendarId, "calendarId")
      }
    } catch (err) {
      console.error("Алдаа:", err);
    }
  };


  const renderTimeSlots = (date: string) => (
    <div className="grid grid-cols-6 gap-1.5">
      {timeSlots.map((time) => (
        <button
          key={time}
          onClick={() => handleTimeClick(time, date)}
          className={`px-2 py-1.5 rounded-lg border text-xs transition-colors ${
            selectedTimesByDate[date]?.includes(time)
              ? "bg-white text-black border-white"
              : "text-white border-white hover:bg-white/10"
          }`}
        >
          {time}
        </button>
      ))}
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-[15px]">
      {[
        { label: "08/04 - 08/10", dates: week1Dates, pos: "top" },
        { label: "08/11 - 08/17", dates: week2Dates, pos: "bottom" },
      ].map((week) => (
        <div key={week.label} className="flex flex-col gap-[15px]">
          <p className="text-white text-center text-sm font-medium">
            {week.label}
          </p>
          <div className="flex justify-between gap-[8px]">
            {week.dates.map(({ day, date }) => (
              <button
                key={date}
                onClick={() =>
                  handleDateClick(date, week.pos as "top" | "bottom")
                }
                className={`flex flex-col items-center justify-center w-[45px] h-[45px] rounded-full border transition-colors ${
                  activeDate === date
                    ? "bg-white text-black border-white"
                    : selectedTimesByDate[date]?.length > 0
                    ? "border-green-500 text-white"
                    : "border-white text-white hover:bg-white/10"
                }`}
              >
                <span className="text-[9px] font-medium">{day}</span>
                <span className="text-[12px] font-semibold">{date}</span>
              </button>
            ))}
          </div>

          {((activeDate && activeDatePosition === week.pos) ||
            (isAnimating &&
              animatingDate &&
              animatingPosition === week.pos)) && (
            <div
              className={`overflow-hidden transition-all duration-300 ${
                isAnimating ? "animate-slideUp" : "animate-slideDown"
              }`}
            >
              {renderTimeSlots(activeDate || animatingDate || "")}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MentorCalendar;
