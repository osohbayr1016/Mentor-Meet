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
        const meetingPromises = availabilityRequests.map(async (request) => {
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
            return meetingData.hangoutLink;
          }
          return null;
        });
        
        const meetingLinks = await Promise.all(meetingPromises);
        const validMeetingLinks = meetingLinks.filter(link => link !== null);
        setMeetingLinks(validMeetingLinks);
      } else {
        const data = await availabilityResponse.json();
        setError(data.error || "Failed to mark availability");
      }
    } catch (error) {
      console.error("Error marking availability:", error);
      setError("Failed to mark availability. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (meetingLinks.length > 0) {
      const meetingText = meetingLinks.join("\n");
      navigator.clipboard.writeText(meetingText);
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
                    Google Meet холболтууд:
                  </p>
                  <div className="bg-white/10 p-3 rounded-lg max-h-32 overflow-y-auto">
                    {meetingLinks.map((meeting, index) => (
                      <p key={index} className="text-white text-sm break-all mb-2">
                        {meeting}
                      </p>
                    ))}
                  </div>
                  <p className="text-white/60 text-xs mt-2">
                    08/{selectedDate} - {selectedTime}
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleCopyLink}
                    className="px-6 py-3 text-white border border-white/30 rounded-[40px] hover:bg-white/10 transition-colors"
                  >
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
