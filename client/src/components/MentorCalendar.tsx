"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import BookingModal from "./BookingModal";
import { headers } from "next/headers";
import axios from "axios";

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
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [activeDatePosition, setActiveDatePosition] = useState<"top" | "bottom">("top");
  const [isAnimating, setIsAnimating] = useState(false);
  const [animatingDate, setAnimatingDate] = useState<string | null>(null);
  const [animatingPosition, setAnimatingPosition] = useState<"top" | "bottom">("top");

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
    "09:00", "10:00", "11:00", "12:00", "13:00", "14:00",
    "15:00", "16:00", "17:00", "18:00", "19:00", "20:00",
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
    if (!mentorId) return;

    const token = localStorage.getItem("mentorToken");
    if (!token) return alert("Нэвтрэх шаардлагатай!");

    // өөрчлөгдсөн утгаа пайж руу дамжуулдаг функц юм шиг байна.
    onTimeSelect?.(date, time);

    // шинэчилж сонгосон цагуудаа энэ дотор задалж бэлдээд байгаа юм уу даа.
    //
    const newTimes = { ...selectedTimesByDate };
    const times = newTimes[date] || [];
    // асуух?
    const updatedTimes = times.includes(time)
      ? times.filter((t) => t !== time)
      : [...times, time];

    newTimes[date] = updatedTimes;

    const availabilities = Object.entries(newTimes).map(([date, times]) => ({
      // энэ object.entries ийг анх удаа л харж байна
      date: `2025-08-${date.padStart(2, "0")}`,
      times,
    }));

    try {
      const res = await axios.post(
        "http://localhost:8000/Calendar",
        { availabilities },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Амжилттай хадгаллаа:", res.data);
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
      {[{ label: "08/04 - 08/10", dates: week1Dates, pos: "top" }, { label: "08/11 - 08/17", dates: week2Dates, pos: "bottom" }].map((week) => (
        <div key={week.label} className="flex flex-col gap-[15px]">
          <p className="text-white text-center text-sm font-medium">{week.label}</p>
          <div className="flex justify-between gap-[8px]">
            {week.dates.map(({ day, date }) => (
              <button
                key={date}
                onClick={() => handleDateClick(date, week.pos as "top" | "bottom")}
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
            (isAnimating && animatingDate && animatingPosition === week.pos)) && (
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


// interface MentorCalendarProps {
//   mentorId?: string;
//   onTimeSelect?: (date: string, time: string) => void;
//   selectedTimesByDate?: Record<string, string[]>;
// }

// const MentorCalendar: React.FC<MentorCalendarProps> = ({
//   mentorId,
//   onTimeSelect,
//   selectedTimesByDate = {},
// }) => {

//   const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
//   const [activeDate, setActiveDate] = useState<string | null>(null);
//   const [activeDatePosition, setActiveDatePosition] = useState<
//     "top" | "bottom"
//   >("top");
//   const [isAnimating, setIsAnimating] = useState(false);
//   const [animatingDate, setAnimatingDate] = useState<string | null>(null);
//   const [animatingPosition, setAnimatingPosition] = useState<"top" | "bottom">(
//     "top"
//   );

//   // Generate dates for two weeks starting from August 4th
//   const week1Dates = [
//     { day: "Да", date: "4" },
//     { day: "Мя", date: "5" },
//     { day: "Лх", date: "6" },
//     { day: "Пү", date: "7" },
//     { day: "Ба", date: "8" },
//     { day: "Бя", date: "9" },
//     { day: "Ня", date: "10" },
//   ];

//   const week2Dates = [
//     { day: "Да", date: "11" },
//     { day: "Мя", date: "12" },
//     { day: "Лх", date: "13" },
//     { day: "Пү", date: "14" },
//     { day: "Ба", date: "15" },
//     { day: "Бя", date: "16" },
//     { day: "Ня", date: "17" },
//   ];

//   // Time slots from 09:00 to 20:00
//   const timeSlots = [
//     "09:00",
//     "10:00",
//     "11:00",
//     "12:00",
//     "13:00",
//     "14:00",
//     "15:00",
//     "16:00",
//     "17:00",
//     "18:00",
//     "19:00",
//     "20:00",
//   ];


  
//   const handleDateClick = (date: string, position: "top" | "bottom") => {
//     if (activeDate === date) {
//       // Start slide-up animation
//       setIsAnimating(true);
//       setAnimatingDate(date);
//       setAnimatingPosition(position);

//       // After animation completes, hide the time slots
//       setTimeout(() => {
//         setActiveDate(null);
//         setActiveDatePosition("top");
//         setIsAnimating(false);
//         setAnimatingDate(null);
//       }, 300); // Match animation duration
//     } else {
//       setActiveDate(date);
//       setActiveDatePosition(position);
//     }
//   };

//   const handleTimeClick = async (time: string, date: string) => {
//     const token = localStorage.getItem("mentorToken");
//  const availabilities = Object.entries(selectedTimesByDate).map(([date, times]) => ({
//     date: `2025-08-${date.padStart(2, "0")}`,
//     times,
//   }));


//     try {
//       const response = await axios.post(
//         "http://localhost:9000/Calendar",
//         { availabilities: { date, time } },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       console.log("Response:", response.data);
//       console.log(time, "time");

//       if (onTimeSelect) {
//         onTimeSelect(date, time);
//       }
//     } catch (error) {
//       console.error("Error posting to /Calendar:", error);
//     }
//   };

//   useEffect(() => {}, []);

//   return (
//     <div className="w-full">
//       <div className="w-full flex flex-col gap-[15px]">
//         {/* Week 1 */}
//         <div className="flex flex-col gap-[15px]">
//           <p className="font-[500] text-[14px] text-white text-center">
//             08/04 - 08/10
//           </p>
//           <div className="flex justify-between gap-[8px]">
//             {week1Dates.map((item) => (
//               <button
//                 key={item.date}
//                 onClick={() => handleDateClick(item.date, "top")}
//                 className={`flex flex-col items-center justify-center w-[45px] h-[45px] rounded-full border-1 transition-colors ${
//                   activeDate === item.date
//                     ? "bg-white text-black border-white"
//                     : selectedTimesByDate[item.date]?.length > 0
//                     ? "border-green-500 text-white"
//                     : "border-white text-white hover:bg-white/10"
//                 }`}
//               >
//                 <span className="text-[9px] font-medium">{item.day}</span>
//                 <span className="text-[12px] font-semibold">{item.date}</span>
//               </button>
//             ))}
//           </div>

//           {/* Time slots for Week 1 */}
//           {((activeDate && activeDatePosition === "top") ||
//             (isAnimating && animatingDate && animatingPosition === "top")) && (
//             <div
//               className={`overflow-hidden ${
//                 isAnimating && animatingDate && animatingPosition === "top"
//                   ? "animate-slideUp"
//                   : "animate-slideDown"
//               }`}
//             >
//               <div className="grid grid-cols-6 gap-1.5">
//                 {timeSlots.map((time) => (
//                   <div key={time} className="flex flex-col gap-1">
//                     <button
//                       onClick={() =>
//                         handleTimeClick(time, activeDate || animatingDate || "")
//                       }
//                       className={`px-2 py-1.5 rounded-lg border border-white transition-colors text-xs ${
//                         selectedTimesByDate[
//                           activeDate || animatingDate || ""
//                         ]?.includes(time)
//                           ? "bg-white text-black"
//                           : "text-white hover:bg-white/10"
//                       }`}
//                     >
//                       {time}
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Week 2 */}
//         <div className="flex flex-col gap-[15px]">
//           <p className="font-[500] text-[14px] text-white text-center">
//             08/11 - 08/17
//           </p>
//           <div className="flex justify-between gap-[8px]">
//             {week2Dates.map((item) => (
//               <button
//                 key={item.date}
//                 onClick={() => handleDateClick(item.date, "bottom")}
//                 className={`flex flex-col items-center justify-center w-[45px] h-[45px] rounded-full border-1 transition-colors ${
//                   activeDate === item.date
//                     ? "bg-white text-black border-white"
//                     : selectedTimesByDate[item.date]?.length > 0
//                     ? "border-green-500 text-white"
//                     : "border-white text-white hover:bg-white/10"
//                 }`}
//               >
//                 <span className="text-[9px] font-medium">{item.day}</span>
//                 <span className="text-[12px] font-semibold">{item.date}</span>
//               </button>
//             ))}
//           </div>

//           {/* Time slots for Week 2 */}
//           {((activeDate && activeDatePosition === "bottom") ||
//             (isAnimating &&
//               animatingDate &&
//               animatingPosition === "bottom")) && (
//             <div
//               className={`overflow-hidden ${
//                 isAnimating && animatingDate && animatingPosition === "bottom"
//                   ? "animate-slideUp"
//                   : "animate-slideDown"
//               }`}
//             >
//               <div className="grid grid-cols-6 gap-1.5 ">
//                 {timeSlots.map((time) => (
//                   <div key={time} className="flex flex-col gap-1">
//                     <button
//                       onClick={() =>
//                         handleTimeClick(time, activeDate || animatingDate || "")
//                       }
//                       className={`px-2 py-1.5 rounded-lg border border-white transition-colors text-xs ${
//                         selectedTimesByDate[
//                           activeDate || animatingDate || ""
//                         ]?.includes(time)
//                           ? "bg-white text-black"
//                           : "text-white hover:bg-white/10"
//                       }`}
//                     >
//                       {time}
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MentorCalendar;
