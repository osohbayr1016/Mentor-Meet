"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface MeetingData {
  eventId: string;
  hangoutLink: string;
  startTime: string;
  endTime: string;
  title: string;
  description?: string;
  attendees?: { email: string }[];
}

interface MeetingManagerProps {
  className?: string;
}

export default function MeetingManager({
  className = "",
}: MeetingManagerProps) {
  const { data: session } = useSession();
  const [meetings, setMeetings] = useState<MeetingData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMeetings = async () => {
    if (!session?.accessToken) {
      setError("Нэвтрэх шаардлагатай");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/get-meetings", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMeetings(data.meetings || []);
      } else {
        setError("Уулзалтууд авахад алдаа гарлаа");
      }
    } catch (error) {
      console.error("Error fetching meetings:", error);
      setError("Уулзалтууд авахад алдаа гарлаа");
    } finally {
      setIsLoading(false);
    }
  };

  const cancelMeeting = async (eventId: string) => {
    if (!session?.accessToken) {
      setError("Нэвтрэх шаардлагатай");
      return;
    }

    try {
      const response = await fetch("/api/cancel-meeting", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId }),
      });

      if (response.ok) {
        setMeetings((prev) =>
          prev.filter((meeting) => meeting.eventId !== eventId)
        );
        setError(null);
      } else {
        setError("Уулзалт цуцлахад алдаа гарлаа");
      }
    } catch (error) {
      console.error("Error canceling meeting:", error);
      setError("Уулзалт цуцлахад алдаа гарлаа");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("mn-MN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isUpcoming = (startTime: string) => {
    return new Date(startTime) > new Date();
  };

  useEffect(() => {
    if (session?.accessToken) {
      fetchMeetings();
    }
  }, [session]);

  if (!session) {
    return (
      <div className={`p-6 bg-white rounded-lg shadow-md ${className}`}>
        <p className="text-gray-600 text-center">
          Уулзалтууд харахын тулд нэвтэрнэ үү
        </p>
      </div>
    );
  }

  return (
    <div className={`p-6 bg-white rounded-lg shadow-md ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Миний Уулзалтууд</h2>
        <button
          onClick={fetchMeetings}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin"></div>
              Ачааллаж байна...
            </div>
          ) : (
            "Шинэчлэх"
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {meetings.length === 0 && !isLoading ? (
        <div className="text-center py-8 text-gray-500">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p>Төлөвлөгдсөн уулзалт байхгүй байна</p>
        </div>
      ) : (
        <div className="space-y-4">
          {meetings.map((meeting) => (
            <div
              key={meeting.eventId}
              className={`border rounded-lg p-4 ${
                isUpcoming(meeting.startTime)
                  ? "border-green-200 bg-green-50"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-800">
                    {meeting.title || "Mentorship Session"}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {formatDate(meeting.startTime)}
                  </p>
                  {meeting.description && (
                    <p className="text-gray-500 text-sm mt-2">
                      {meeting.description}
                    </p>
                  )}
                  {meeting.attendees && meeting.attendees.length > 0 && (
                    <div className="mt-2">
                      <span className="text-sm text-gray-600">
                        Оролцогчид:{" "}
                      </span>
                      {meeting.attendees.map((attendee, index) => (
                        <span key={index} className="text-sm text-gray-800">
                          {attendee.email}
                          {index < meeting.attendees!.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  {isUpcoming(meeting.startTime) && (
                    <>
                      <button
                        onClick={() =>
                          window.open(meeting.hangoutLink, "_blank")
                        }
                        className="px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                      >
                        Нээх
                      </button>
                      <button
                        onClick={() => cancelMeeting(meeting.eventId)}
                        className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                      >
                        Цуцлах
                      </button>
                    </>
                  )}
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(meeting.hangoutLink)
                    }
                    className="px-3 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                    title="Холболт хуулах"
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
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
