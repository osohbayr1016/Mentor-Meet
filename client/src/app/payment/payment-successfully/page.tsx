"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { PartyPopper, Calendar, Clock, Video } from "lucide-react";

const MentorCalendar = () => {
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    // Get meeting data from localStorage
    const completedMeetings = localStorage.getItem("completedMeetings");
    if (completedMeetings) {
      try {
        const parsedMeetings = JSON.parse(completedMeetings);
        setMeetings(parsedMeetings);
        // Clear the data after retrieving it
        localStorage.removeItem("completedMeetings");
      } catch (error) {
        console.error("Error parsing meeting data:", error);
      }
    }
  }, []);

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
                    <PartyPopper size={32} />
                  </p>
                </div>

                {meetings.length > 0 && (
                  <div className="flex flex-col gap-[15px] max-h-[300px] overflow-y-auto">
                    <p className="font-semibold text-[16px] text-white text-center">
                      Таны уулзалтууд:
                    </p>
                    {meetings.map((meeting: any, index: number) => (
                      <div
                        key={index}
                        className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar size={16} className="text-white/80" />
                          <span className="text-white text-sm">
                            {new Date(meeting.startTime).toLocaleDateString(
                              "mn-MN"
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Clock size={16} className="text-white/80" />
                          <span className="text-white text-sm">
                            {new Date(meeting.startTime).toLocaleTimeString(
                              "mn-MN",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}{" "}
                            -{" "}
                            {new Date(meeting.endTime).toLocaleTimeString(
                              "mn-MN",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                        {meeting.hangoutLink && (
                          <div className="flex items-center gap-2">
                            <Video size={16} className="text-green-400" />
                            <a
                              href={meeting.hangoutLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-400 hover:text-green-300 text-sm underline"
                            >
                              Google Meet-д орох
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-col gap-[20px] text-center">
                  <p className="font-semibold text-[16px] text-white">
                    {meetings.length > 0
                      ? "Уулзалтын холбоосууд дээр байгаа. Цагт нь орж ирээрэй!"
                      : "Уулзалтын мэдээлэл түр хүлээгдэж байна..."}
                  </p>
                  <div className="flex justify-center gap-4">
                    <Link
                      href="/meetings"
                      className="bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full hover:bg-white/30 transition"
                    >
                      Миний уулзалтууд
                    </Link>
                    <Link
                      href="/"
                      className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition"
                    >
                      Нүүр хуудас
                    </Link>
                  </div>
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

export default MentorCalendar;
