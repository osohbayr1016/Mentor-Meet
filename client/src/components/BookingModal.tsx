"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  selectedTime: string;
  totalPrice?: number;
  selectedTimes?: string[];
  selectedTimesByDate?: Record<string, string[]>;
  MentorId: string;
}

interface MeetingResponse {
  hangoutLink: string;
  eventId: string;
  startTime: string;
  endTime: string;
}

export default function BookingModal({
  isOpen,
  onClose,
  selectedDate,
  selectedTime,
  totalPrice = 0,
  selectedTimes = [],
  selectedTimesByDate = {},
  MentorId,
}: BookingModalProps) {
  // Check for student authentication in localStorage
  const studentToken =
    typeof window !== "undefined" ? localStorage.getItem("studentToken") : null;
  const studentUser =
    typeof window !== "undefined" ? localStorage.getItem("studentUser") : null;

  const isAuthenticated = studentToken && studentUser;
  const userEmail = studentUser
    ? (() => {
        try {
          return JSON.parse(studentUser).email;
        } catch (error) {
          console.error("Error parsing student user data:", error);
          return null;
        }
      })()
    : null;
  const [isLoading, setIsLoading] = useState(false);
  const [meetingLinks, setMeetingLinks] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreateBooking = async () => {
    if (!isAuthenticated) {
      setError("Хэрэглэгч нэвтрэх шаардлагатай!");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get student data from localStorage
      const studentUserData = JSON.parse(studentUser!);
      const studentId = studentUserData.studentId;

      // Create bookings for all selected times
      const bookingPromises = [];

      for (const [date, times] of Object.entries(selectedTimesByDate)) {
        for (const time of times) {
          const bookingData = {
            mentorId: MentorId,
            studentId: studentId,
            date: `2025-08-${date.padStart(2, "0")}`,
            time: time,
            duration: 60, // 1 hour
            price:
              totalPrice / Object.values(selectedTimesByDate).flat().length, // Divide total price by number of slots
            category: "General", // You can make this dynamic based on mentor's category
            notes: `Booking for ${date} at ${time}`,
          };

          bookingPromises.push(
            fetch("/api/create-booking", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(bookingData),
            })
          );
        }
      }

      const bookingResponses = await Promise.all(bookingPromises);
      const bookingResults = await Promise.all(
        bookingResponses.map((response) => response.json())
      );

      const successfulBookings = bookingResults.filter(
        (result) => result.success
      );
      const failedBookings = bookingResults.filter((result) => !result.success);

      if (successfulBookings.length > 0) {
        const bookingMessages = successfulBookings.map((booking: any) => {
          const bookingData = booking.booking;
          return `08/${bookingData.date.split("-")[2]} - ${bookingData.time}`;
        });

        setMeetingLinks(bookingMessages);
        setSuccessMessage(
          `${successfulBookings.length} захиалга амжилттай үүсгэгдлээ!`
        );
      } else {
        setError(
          failedBookings[0]?.error ||
            "Захиалга үүсгэхэд алдаа гарлаа. Дахин оролдоно уу."
        );
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      setError("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (meetingLinks.length > 0) {
      try {
        const meetingText = meetingLinks.join("\n");
        await navigator.clipboard.writeText(meetingText);
        setSuccessMessage("Холболтууд амжилттай хуулагдлаа!");
        setTimeout(() => setSuccessMessage(null), 2000);
      } catch (error) {
        setError("Холболт хуулахад алдаа гарлаа.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="w-6/10 h-7/10 flex items-center justify-center">
        <div className="w-full h-full border-gray-400/50 border-1 backdrop-blur-md bg-black/20 flex flex-col items-center justify-center rounded-[20px]">
          {/* Header */}
          <div className="flex gap-3 mb-8">
            <Image
              src="/image709.png"
              alt="Mentor Meet Logo"
              width={29}
              height={24}
            />
            <p className="font-[700] text-[22px] text-white">Mentor Meet</p>
          </div>
          {successMessage && (
            <div className="bg-green-500/20 border border-green-500/30 text-green-200 px-4 py-2 rounded-lg text-sm mb-4">
              {successMessage}
            </div>
          )}

          {/* Content */}
          <div className="flex flex-col items-center gap-6 px-8 text-center">
            {meetingLinks.length === 0 ? (
              <>
                <div>
                  <h3 className="font-[600] text-[20px] text-white mb-4">
                    Захиалга баталгаажуулах
                  </h3>
                  <div className="space-y-2 text-white/80 text-sm">
                    <p>Сонгосон өдрүүд:</p>
                    {Object.entries(selectedTimesByDate).map(
                      ([date, times]) => (
                        <div key={date} className="ml-2">
                          <p>
                            08/{date}: {times.join(", ")}
                          </p>
                        </div>
                      )
                    )}
                    <p>Нийт цаг: {selectedTimes.length} цаг</p>
                    <p className="font-semibold text-white">
                      Нийт үнэ: {totalPrice.toLocaleString()}₮
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={onClose}
                    className="px-6 py-3 text-white border border-white/30 rounded-[40px] hover:bg-white/10 transition-colors"
                    disabled={isLoading}
                  >
                    Цуцлах
                  </button>
                  <Link
                    href={`/payment/${MentorId}?times=${encodeURIComponent(
                      JSON.stringify(selectedTimesByDate)
                    )}`}
                  >
                    <button
                      onClick={handleCreateBooking}
                      disabled={isLoading}
                      className="px-6 py-3 bg-white text-black rounded-[40px] hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border border-black/30 border-t-black rounded-full animate-spin"></div>
                          Захиалга хийж байна...
                        </div>
                      ) : (
                        "Захиалга баталгаажуулах"
                      )}
                    </button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h3 className="font-[600] text-[20px] text-white mb-4">
                    Захиалга амжилттай хийгдлээ!
                  </h3>
                  <p className="text-white/80 text-sm mb-4">
                    Google Meet холболтууд ({meetingLinks.length}):
                  </p>
                  <div className="bg-white/10 p-3 rounded-lg max-h-32 overflow-y-auto space-y-2">
                    {meetingLinks.map((meeting, index) => (
                      <div
                        key={index}
                        className="bg-white/5 p-2 rounded border"
                      >
                        <p className="text-white text-xs break-all">
                          {meeting}
                        </p>
                        <button
                          onClick={() => window.open(meeting, "_blank")}
                          className="text-blue-300 hover:text-blue-200 text-xs mt-1 underline"
                        >
                          Нээх
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-white/60 text-xs mt-2">
                    08/{selectedDate} - {selectedTime}
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleCopyLink}
                    className="px-6 py-3 text-white border border-white/30 rounded-[40px] hover:bg-white/10 transition-colors flex items-center gap-2"
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
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Холболт хуулах
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-white text-black rounded-[40px] hover:bg-gray-100 transition-colors"
                  >
                    Хаах
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
