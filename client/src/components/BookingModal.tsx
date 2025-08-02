"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
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
  const { data: session } = useSession();

  // Check for mock user in localStorage for development
  const mockUser =
    typeof window !== "undefined" ? localStorage.getItem("mockUser") : null;
  const isAuthenticated = session || mockUser;
  const userEmail =
    session?.user?.email || (mockUser ? JSON.parse(mockUser).email : null);
  const [isLoading, setIsLoading] = useState(false);
  const [meetingLinks, setMeetingLinks] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleMarkAvailability = async () => {
    if (!isAuthenticated) {
      setError("Please sign in to mark availability");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Prepare all availability requests
      const availabilityRequests = [];

      // Process all selected times from all dates
      for (const [date, times] of Object.entries(selectedTimesByDate)) {
        for (const time of times) {
          // Convert selected date and time to ISO string
          const [hours, minutes] = time.split(":");
          const availabilityDate = new Date(
            `2024-08-${date.padStart(2, "0")}T${hours}:${minutes}:00.000Z`
          );
          const endDate = new Date(availabilityDate.getTime() + 60 * 60 * 1000); // 1 hour later

          availabilityRequests.push({
            start: availabilityDate.toISOString(),
            end: endDate.toISOString(),
            mentorEmail: userEmail,
            date: date,
            time: time,
          });
        }
      }

      // First, mark availability
      const availabilityResponse = await fetch("/api/mark-availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          availabilities: availabilityRequests,
        }),
      });

      const data = await availabilityResponse.json();

      if (availabilityResponse.ok && data.success) {
        const createdMeetings = data.results
          .filter((result: any) => result.success)
          .map((result: any) => `08/${result.date} - ${result.time}`);
        setMeetingLinks(createdMeetings);

        // Create Google Meet meetings for each successful availability
        // Create Google Meet meetings for each successful availability
        try {
          const meetingPromises = availabilityRequests.map(async (request) => {
            try {
              const meetingResponse = await fetch("/api/create-meeting", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  start: request.start,
                  end: request.end,
                  mentorEmail: userEmail,
                  menteeEmail: "student@example.com", // Replace with actual student email
                  title: "Mentorship Session",
                  description: `Mentorship session on ${request.date} at ${request.time}`,
                }),
              });

              if (meetingResponse.ok) {
                const meetingData = await meetingResponse.json();
                return {
                  link: meetingData.hangoutLink,
                  eventId: meetingData.eventId,
                  date: request.date,
                  time: request.time,
                  startTime: meetingData.startTime,
                  endTime: meetingData.endTime,
                };
              } else {
                console.error(
                  `Failed to create meeting for ${request.date} at ${request.time}`
                );
                return null;
              }
            } catch (meetingError) {
              console.error(
                `Error creating meeting for ${request.date} at ${request.time}:`,
                meetingError
              );
              return null;
            }
          });

          const meetingResults = await Promise.all(meetingPromises);
          const validMeetings = meetingResults.filter(
            (meeting) => meeting !== null
          );
          const meetingLinks = validMeetings
            .map((meeting) => meeting?.link)
            .filter(Boolean);

          setMeetingLinks(meetingLinks);

          if (validMeetings.length > 0) {
            setSuccessMessage(
              `${validMeetings.length} Google Meet холбооуд амжилттай үүсгэгдлээ!`
            );
          } else {
            setError(
              "Google Meet холбоо үүсгэхэд алдаа гарлаа. Дахин оролдоно уу."
            );
          }
        } catch (meetingError) {
          console.error("Error creating Google Meet links:", meetingError);
          setError(
            "Google Meet холбоо үүсгэхэд алдаа гарлаа. Дахин оролдоно уу."
          );
        }
      } else {
        const data = await availabilityResponse.json();
        setError(
          data.error ||
            "Боломжит цаг тэмдэглэхэд алдаа гарлаа. Дахин оролдоно уу."
        );
      }
    } catch (error) {
      console.error("Error marking availability:", error);
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

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-2 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}
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
                      onClick={handleMarkAvailability}
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
