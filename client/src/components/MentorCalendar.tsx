"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import TimeSlotStatus from "./TimeSlotStatus";

interface MentorCalendarProps {
  mentorId?: string;
  onTimeSelect?: (date: string, time: string) => void;
  selectedTimesByDate?: Record<string, string[]>;
  onBookingComplete?: () => void; // Callback to refresh booked slots
  mentorAvailability?: Record<string, string[]>; // Mentor's available time slots
  refreshToken?: number; // external trigger to re-fetch booked slots
}

interface BookedSlotsResponse {
  success: boolean;
  message: string;
  data: Record<string, string[]>;
}

interface StudentProps {
  studentId?: string;
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
  onBookingComplete,
  mentorAvailability = {},
  refreshToken,
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
  const [bookedSlots, setBookedSlots] = useState<Record<string, string[]>>({});
  const [isLoadingBookedSlots, setIsLoadingBookedSlots] = useState(false);

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

  // Function to fetch booked slots
  const fetchBookedSlots = async () => {
    if (!mentorId) return;

    setIsLoadingBookedSlots(true);
    try {
      const response = await axios.get<BookedSlotsResponse>(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/mentor-booked-slots/${mentorId}`
      );

      if (response.data.success) {
        const raw = response.data.data || {};
        const normalized: Record<string, string[]> = Object.fromEntries(
          Object.entries(raw).map(([day, value]) => {
            const times = Array.isArray(value)
              ? (value as string[])
              : Array.isArray((value as any)?.times)
              ? ((value as any).times as string[])
              : [];
            return [day.padStart(2, "0"), times];
          })
        );
        setBookedSlots(normalized);
        console.log("Fetched booked slots (normalized):", normalized);
      }
    } catch (error) {
      console.error("Error fetching booked slots:", error);
    } finally {
      setIsLoadingBookedSlots(false);
    }
  };

  // Fetch booked slots for the mentor
  useEffect(() => {
    fetchBookedSlots();
  }, [mentorId, refreshToken]);

  // Debug: Log current date
  useEffect(() => {
    const today = new Date();
    console.log("Current date:", today.toDateString());
    console.log("Current day:", today.getDate());
  }, []);

  // Expose refresh function to parent component
  useEffect(() => {
    if (onBookingComplete) {
      onBookingComplete();
    }
  }, [onBookingComplete]);

  // Check if a date is in the past (before today)
  const isDateInPast = (date: string): boolean => {
    const today = new Date();
    const currentDate = today.getDate().toString().padStart(2, "0");
    const currentMonth = (today.getMonth() + 1).toString().padStart(2, "0");
    const currentYear = today.getFullYear();

    // Convert date string to number for comparison
    const dateNum = parseInt(date);
    const currentDateNum = parseInt(currentDate);

    // If we're in August 2025, check if the date is before today
    if (dateNum < currentDateNum) {
      console.log(`Date ${date} is in the past`);
      return true;
    }

    return false;
  };

  // Check if mentor provided any availability for the date
  const hasMentorAvailabilityForDate = (date: string): boolean => {
    const key = date.padStart(2, "0");
    const availableTimes = mentorAvailability[key] || [];
    return Array.isArray(availableTimes) && availableTimes.length > 0;
  };

  // Check if all mentor-available times for the date have been booked
  const isDateFullyBooked = (date: string): boolean => {
    const key = date.padStart(2, "0");
    const availableTimes = mentorAvailability[key] || [];
    if (availableTimes.length === 0) return false; // handled as "no availability"
    const bookedForDate = new Set(bookedSlots[key] || []);
    return availableTimes.every((t) => bookedForDate.has(t));
  };

  // Date disabled if past, no availability set, or fully booked
  const isDateDisabled = (date: string): boolean => {
    if (isDateInPast(date)) return true;
    if (!hasMentorAvailabilityForDate(date)) return true;
    if (isDateFullyBooked(date)) return true;
    return false;
  };

  // Check if a time slot is disabled (booked, past time, or not available)
  const isTimeSlotDisabled = (time: string, date: string): boolean => {
    // Check if the date is in the past
    if (isDateInPast(date)) {
      return true;
    }

    // Check if the mentor has set this time as available
    const key = date.padStart(2, "0");
    const isAvailable = mentorAvailability[key]?.includes(time);
    if (!isAvailable) {
      console.log(`Slot ${time} on ${date} is not available from mentor`);
      return true;
    }

    // Check if the time is already booked
    const isBooked = bookedSlots[key]?.includes(time);

    // Check if the time has passed (for today)
    const today = new Date();
    const currentDate = today.getDate().toString().padStart(2, "0");
    const currentMonth = (today.getMonth() + 1).toString().padStart(2, "0");
    const currentYear = today.getFullYear();

    if (key === currentDate) {
      const [hours, minutes] = time.split(":").map(Number);
      const slotTime = new Date(
        currentYear,
        parseInt(currentMonth) - 1,
        parseInt(key),
        hours,
        minutes
      );
      const now = new Date();

      const isPast = slotTime <= now;
      if (isBooked || isPast) {
        console.log(`Slot ${time} on ${date} is disabled:`, {
          isBooked,
          isPast,
        });
      }

      return isBooked || isPast;
    }

    if (isBooked) {
      console.log(`Slot ${time} on ${date} is booked`);
    }

    return isBooked;
  };

  const handleDateClick = (date: string, position: "top" | "bottom") => {
    // Don't allow clicking on disabled dates
    if (isDateDisabled(date)) return;

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
    // Block selection if disabled (not in mentor availability, booked, or past)
    if (isTimeSlotDisabled(time, date)) return;

    // Delegate selection handling to parent; this component is read-only wrt persistence
    onTimeSelect?.(date, time);
  };

  const renderTimeSlots = (date: string) => (
    <div className="grid grid-cols-6 gap-1.5">
      {timeSlots.map((time) => {
        const key = date.padStart(2, "0");
        const isDisabled = isTimeSlotDisabled(time, date);
        const isSelected = selectedTimesByDate[date]?.includes(time);
        const isBooked = (bookedSlots[key] || []).includes(time);

        // Determine the reason for being disabled
        const getDisabledReason = () => {
          if (isDateInPast(date)) {
            return "Энэ өдөр өнгөрсөн";
          }

          // Check if mentor has set this time as available
          const isAvailable = mentorAvailability[key]?.includes(time);
          if (!isAvailable) {
            return "Ментор энэ цагийг чөлөөтэй гэж тэмдэглээгүй";
          }

          if (isBooked) {
            return "Энэ цаг захиалагдсан";
          }

          const today = new Date();
          const currentDate = today.getDate().toString().padStart(2, "0");
          if (key === currentDate) {
            const [hours, minutes] = time.split(":").map(Number);
            const currentMonth = (today.getMonth() + 1)
              .toString()
              .padStart(2, "0");
            const currentYear = today.getFullYear();
            const slotTime = new Date(
              currentYear,
              parseInt(currentMonth) - 1,
              parseInt(key),
              hours,
              minutes
            );
            const now = new Date();

            if (slotTime <= now) {
              return "Энэ цаг өнгөрсөн";
            }
          }

          return "Энэ цаг захиалагдсан эсвэл өнгөрсөн";
        };

        return (
          <TimeSlotStatus
            key={time}
            time={time}
            date={date}
            isDisabled={isDisabled}
            isSelected={isSelected}
            onClick={() => handleTimeClick(time, date)}
            disabledReason={getDisabledReason()}
            isBooked={isBooked}
          />
        );
      })}
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-[15px]">
      {/* Legend */}
      <div className="flex justify-center gap-4 text-xs text-white/80 mb-2">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full border border-white"></div>
          <span>Чөлөөтэй</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full border border-green-500"></div>
          <span>Сонгосон</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full border border-red-500"></div>
          <span>Захиалагдсан</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full border border-gray-600 opacity-50"></div>
          <span>Өнгөрсөн/Чөлөөтэй биш</span>
        </div>
      </div>

      {[
        { label: "08/04 - 08/10", dates: week1Dates, pos: "top" },
        { label: "08/11 - 08/17", dates: week2Dates, pos: "bottom" },
      ].map((week) => (
        <div key={week.label} className="flex flex-col gap-[15px]">
          <p className="text-white text-center text-sm font-medium">
            {week.label}
          </p>
          <div className="flex justify-between gap-[8px]">
            {week.dates.map(({ day, date }) => {
              const key = date.padStart(2, "0");
              const disabled = isDateDisabled(date);
              const fullyBooked = isDateFullyBooked(date);
              const hasSelection =
                (selectedTimesByDate[date]?.length || 0) > 0 ||
                (selectedTimesByDate[key]?.length || 0) > 0;
              const hasAnyBooked = (bookedSlots[key]?.length || 0) > 0;
              const title = disabled
                ? isDateInPast(date)
                  ? "Өнгөрсөн өдөр"
                  : fullyBooked
                  ? "Захиалагдсан"
                  : "Ментор энэ өдөр боломжит цаг оруулаагүй"
                : hasAnyBooked
                ? "Захиалагдсан"
                : hasSelection
                ? "Сонгосон өдөр"
                : undefined;

              return (
                <button
                  key={key}
                  onClick={() =>
                    handleDateClick(date, week.pos as "top" | "bottom")
                  }
                  disabled={disabled}
                  title={title}
                  className={`flex flex-col items-center justify-center w-[45px] h-[45px] rounded-full border transition-colors ${
                    disabled
                      ? fullyBooked
                        ? "border-red-500 text-white cursor-not-allowed"
                        : "border-gray-600 text-gray-400 opacity-50 cursor-not-allowed"
                      : activeDate === date
                      ? "bg-white text-black border-white"
                      : hasAnyBooked
                      ? "border-red-500 text-white"
                      : hasSelection
                      ? "border-green-500 text-white"
                      : "border-white text-white hover:bg-white/10"
                  }`}
                >
                  <span className="text-[9px] font-medium">{day}</span>
                  <span className="text-[12px] font-semibold">{date}</span>
                </button>
              );
            })}
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
              {isLoadingBookedSlots ? (
                <div className="flex justify-center items-center py-4">
                  <div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="text-white text-xs ml-2">
                    Уншиж байна...
                  </span>
                </div>
              ) : (
                renderTimeSlots(activeDate || animatingDate || "")
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MentorCalendar;
