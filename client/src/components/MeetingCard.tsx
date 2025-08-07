"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { ConfirmModal } from "../app/_components/ConfirmModal";


export interface MeetingCardProps {
  meeting: {
    id: string;
    date: string;
    day?: string;
    time: string;
    studentEmail: string;
    status: "scheduled" | "cancelled" | "completed";
  };
  showActions?: boolean;
  onJoinMeeting?: (meetingId: string) => void;
  onCancelMeeting?: (meetingId: string) => void;
}


export const MeetingCard: React.FC<MeetingCardProps> = ({
  meeting,
  onJoinMeeting,
  onCancelMeeting,
  showActions = true,
}) => {
  const { id, date, day, time, studentEmail, status } = meeting;
  const formattedDate = format(new Date(date), "yyyy-MM-dd");

  const [showConfirm, setShowConfirm] = useState(false);

  const handleCancelClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmCancel = () => {
    if (onCancelMeeting) {
      onCancelMeeting(id);
    }
    setShowConfirm(false);
  };

  const handleCancelModal = () => {
    setShowConfirm(false);
  };

  const getStatusBadge = () => {
    switch (status) {
      case "scheduled":
        return (
          <span className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
            🕒 Товлогдсон
          </span>
        );
      case "completed":
        return (
          <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            ✔ Дууссан
          </span>
        );
      case "cancelled":
        return (
          <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            ✖ Цуцлагдсан
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="bg-[#1A1A1A] rounded-xl p-4 w-full max-w-sm flex flex-col justify-between shadow-md text-white border border-gray-700 hover:border-gray-500 transition duration-300">
        <div className="flex justify-end mb-2">{getStatusBadge()}</div>

        <div className="mb-3 space-y-1">
          <p className="text-sm font-light">
            📅 Уулзалтын өдөр: <span className="font-medium">{formattedDate}</span>
          </p>
          {day && (
            <p className="text-sm font-light">
              📆 <span className="font-medium">{day}</span>
            </p>
          )}
          <p className="text-sm font-light">
            ⏰ Уулзалтын цаг: <span className="font-medium">{time}</span>
          </p>
          <p className="text-sm font-light">
            👤 Суралцагч: <span className="font-medium">{studentEmail}</span>
          </p>
        </div>

        {showActions && status === "scheduled" && (
          <div className="flex flex-col sm:flex-row gap-2 mt-3">
            <button
              onClick={() => onJoinMeeting?.(id)}
              className="flex-1 bg-white text-black rounded-full py-1.5 px-4 font-semibold hover:bg-gray-200 transition"
            >
              Уулзалтанд орох
            </button>
            <button
              onClick={handleCancelClick}
              className="flex-1 border border-white text-white rounded-full py-1.5 px-4 font-semibold hover:bg-white hover:text-black transition"
            >
              Цуцлах
            </button>
          </div>
        )}
      </div>

      
      <ConfirmModal
        open={showConfirm} 
        onClose={handleCancelModal} 
        onConfirm={handleConfirmCancel} 
      />
    </>
  );
};
