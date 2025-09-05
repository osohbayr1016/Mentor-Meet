"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useFirebaseAuth } from "../../lib/firebase-auth";
import { PartyPopper, Copy, ExternalLink, Calendar } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface MeetingData {
  bookingId: string;
  meetingLink: string;
  calendarEventId: string;
  startTime: string;
  endTime: string;
  calendarLink: string;
}

const PaymentSuccessfullyContent = () => {
  const { user } = useFirebaseAuth();
  const searchParams = useSearchParams();
  const [meetingData, setMeetingData] = useState<MeetingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get booking details from URL params
  const bookingId = searchParams.get("bookingId");
  const mentorEmail = searchParams.get("mentorEmail");
  const studentEmail = searchParams.get("studentEmail");
  const date = searchParams.get("date");
  const time = searchParams.get("time");
  const duration = searchParams.get("duration");

  useEffect(() => {
    const generateMeetingLink = async () => {
      if (
        !bookingId ||
        !mentorEmail ||
        !studentEmail ||
        !date ||
        !time ||
        !duration
      ) {
        setError(
          "Booking information not found. You can still access your meeting link from your profile dashboard."
        );
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/generate-meeting-after-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookingId,
            mentorEmail,
            studentEmail,
            date,
            time,
            duration: parseInt(duration),
            title: "Mentorship Session",
            description: `Mentorship session booked through Mentor Meet platform.`,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setMeetingData(result.data);
        } else {
          setError(result.message || "Failed to generate meeting link");
        }
      } catch (err) {
        console.error("Error generating meeting link:", err);
        setError("Network error occurred. Please try refreshing the page.");
      } finally {
        setLoading(false);
      }
    };

    generateMeetingLink();
  }, [bookingId, mentorEmail, studentEmail, date, time, duration]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Meeting link copied to clipboard!");
    });
  };

  const formatDateTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
  };

  return (
    <div className="relative w-full h-screen">
      <div className="absolute inset-0 bg-black/30 -z-10" />
      <Image
        src="/home.jpg"
        alt="background image"
        fill
        className="absolute inset-0 -z-20 object-cover"
      />

      <div className="relative z-10 w-full h-full flex justify-center items-center">
        <div className="w-6/10 h-7/10 flex items-center justify-center">
          <div className="w-full h-full border-gray-400/50 border-1 backdrop-blur-lg bg-black/30 flex flex-col items-center rounded-[20px]">
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
            </div>

            <div className="w-full h-full flex flex-col justify-center items-center px-8">
              <div className="w-full max-w-[600px] flex flex-col gap-[20px]">
                <div className="flex flex-col gap-[20px] text-center justify-center items-center">
                  <p className="font-medium text-[18px] text-white text-center">
                    Таны төлбөр амжилттай төлөгдөж уулзалт баталгаажлаа!
                  </p>
                  <p className="text-[#009812]">
                    <PartyPopper size={48} />
                  </p>
                </div>

                {loading && (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border border-white/30 border-t-white rounded-full animate-spin"></div>
                    <p className="text-white text-center">
                      Google Meet холбоос үүсгэж байна...
                    </p>
                  </div>
                )}

                {error && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                    <p className="text-red-200 text-center text-sm">{error}</p>
                    <p className="text-red-300 text-center text-xs mt-2">
                      Та дараа дахин оролдож болно эсвэл "ПРОФАЙЛ" хэсгээс
                      хурлын холбоосыг авна уу.
                    </p>
                  </div>
                )}

                {meetingData && (
                  <div className="space-y-4">
                    <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                      <h3 className="text-white font-semibold text-center mb-3">
                        🎉 Google Meet холбоос бэлэн боллоо!
                      </h3>

                      <div className="space-y-3">
                        <div className="bg-white/10 rounded-lg p-3">
                          <p className="text-white text-sm font-medium mb-2">
                            Уулзалтын холбоос:
                          </p>
                          <div className="flex items-center gap-2">
                            <a
                              href={meetingData.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-300 hover:text-blue-200 text-sm break-all flex-1"
                            >
                              {meetingData.meetingLink}
                            </a>
                            <button
                              onClick={() =>
                                copyToClipboard(meetingData.meetingLink)
                              }
                              className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition-colors"
                              title="Copy link"
                            >
                              <Copy size={16} className="text-white" />
                            </button>
                          </div>
                        </div>

                        <div className="bg-white/10 rounded-lg p-3">
                          <p className="text-white text-sm font-medium mb-1">
                            Уулзалтын цаг:
                          </p>
                          <p className="text-gray-300 text-sm">
                            {formatDateTime(meetingData.startTime)}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <a
                            href={meetingData.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                          >
                            <ExternalLink size={16} />
                            Уулзалтанд нэгдэх
                          </a>
                          <a
                            href={meetingData.calendarLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                          >
                            <Calendar size={16} />
                            Календарт харах
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3">
                      <p className="text-yellow-200 text-sm text-center">
                        💡 Энэ холбоосыг хадгалаад уулзалтын өдөр ашиглана уу.
                        Мөн та "ПРОФАЙЛ" хэсгээс дахин олж авах боломжтой.
                      </p>
                    </div>
                  </div>
                )}

                {!loading && !error && !meetingData && (
                  <div className="flex flex-col gap-[20px]">
                    <p className="font-semibold text-[18px] text-white text-center">
                      Уулзалтын өдөр та "ПРОФАЙЛ" хэсгээс хурлын холбоосыг авна
                      уу.
                    </p>
                  </div>
                )}

                {error && (
                  <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 mt-4">
                    <h4 className="text-blue-200 font-semibold mb-2">
                      💡 Бусад сонголт:
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-blue-300">
                        • Та дараа "ПРОФАЙЛ" хэсгээс уулзалтын холбоосыг авах
                        боломжтой
                      </p>
                      <p className="text-blue-300">
                        • Менторын профайлаас холбогдож Google Meet холбоос авах
                        боломжтой
                      </p>
                      <p className="text-blue-300">
                        • Эсвэл та тест хуудас ашиглан Google Meet-ийг туршиж
                        болно
                      </p>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Link
                        href="/test-google-meet"
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm transition-colors"
                      >
                        Google Meet тест
                      </Link>
                    </div>
                  </div>
                )}

                <div className="flex justify-center pt-4">
                  <Link
                    href="/student-dashboard"
                    className="bg-white/20 hover:bg-white/30 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                  >
                    Профайл руу очих
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-2 left-6 text-xs text-white/60 z-30">
        <div>Copyright © 2025 Mentor Meet</div>
        <div>All rights reserved.</div>
      </div>
    </div>
  );
};

const PaymentSuccessfully = () => {
  return (
    <Suspense
      fallback={
        <div className="relative w-full h-screen">
          <div className="absolute inset-0 bg-black/30 -z-10" />
          <div className="relative z-10 w-full h-full flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        </div>
      }
    >
      <PaymentSuccessfullyContent />
    </Suspense>
  );
};

export default PaymentSuccessfully;
