"use client";

import React from "react";
import { format } from "date-fns";

interface Meeting {
  id: string;
  date: string;               // ISO формат: "2025-08-07T10:00:00Z"
  day?: string;               // ✅ optional болгосон
  time: string;
  studentEmail: string;
  status: "scheduled" | "cancelled" | "completed";
}

interface MeetingCardProps {
  meeting: Meeting;
  onJoinMeeting?: (meetingId: string) => void;
  onCancelMeeting?: (meetingId: string) => void;
  showActions?: boolean;
}

const MeetingCard: React.FC<MeetingCardProps> = ({
  meeting,
  onJoinMeeting,
  onCancelMeeting,
  showActions = true,
}) => {
  const { id, date, day, time, studentEmail, status } = meeting;

  const formattedDate = format(new Date(date), "yyyy-MM-dd");

  return (
    <div className="bg-[#1A1A1A] rounded-xl p-4 w-full max-w-sm flex flex-col justify-between shadow-md text-white border border-gray-700 hover:border-gray-500 transition">
      <div className="mb-3 space-y-1">
        <p className="text-sm font-light">
          📅 Уулзалтын өдөр: <span className="font-medium">{formattedDate}</span>
        </p>

        {day && (
          <p className="text-sm font-light">
            📆 {day}
          </p>
        )}

        <p className="text-sm font-light">
          ⏰ Уулзалтын цаг: <span className="font-medium">{time}</span>
        </p>
        <p className="text-sm font-light">
          👤 Суралцагч: <span className="font-medium">{studentEmail}</span>
        </p>
      </div>

      {showActions && (
        <div className="flex flex-col sm:flex-row gap-2 mt-2">
          {status === "scheduled" && (
            <>
              <button
                onClick={() => onJoinMeeting?.(id)}
                className="flex-1 bg-white text-black rounded-full py-1.5 px-4 font-semibold hover:bg-gray-200 transition"
              >
                Уулзалтанд орох
              </button>
              <button
                onClick={() => onCancelMeeting?.(id)}
                className="flex-1 border border-white text-white rounded-full py-1.5 px-4 font-semibold hover:bg-white hover:text-black transition"
              >
                Цуцлах
              </button>
            </>
          )}

          {status === "completed" && (
            <p className="text-green-400 font-semibold text-sm text-center">
              ✔ Уулзалт дууссан
            </p>
          )}

          {status === "cancelled" && (
            <p className="text-red-400 font-semibold text-sm text-center">
              ✖ Уулзалт цуцлагдсан
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default MeetingCard;
