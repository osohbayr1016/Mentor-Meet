"use client";

import React from "react";

interface Meeting {
  id: string;
  date: string;
  day: string;
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
  const getStatusText = (status: Meeting["status"]) => {
    switch (status) {
      case "completed":
        return "Дууссан";
      case "cancelled":
        return "Цуцлагдсан";
      default:
        return "";
    }
  };

  const getStatusColor = (status: Meeting["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-600/20 text-green-400";
      case "cancelled":
        return "bg-gray-600/20 text-gray-400";
      default:
        return "";
    }
  };

  return (
    <div className="bg-black/40 rounded-xl p-4 ">
      <div className="space-y-2 text-white mb-4">
        <p>
          <span className="text-gray-400">Уулзалтын өдөр:</span> {meeting.date}{" "}
          {meeting.day}
        </p>
        <p>
          <span className="text-gray-400">Уулзалтын цаг:</span> {meeting.time}
        </p>
        <p>
          <span className="text-gray-400">Суралцагч:</span>{" "}
          {meeting.studentEmail}
        </p>
      </div>

      {showActions && (
        <div className="flex gap-2">
          {meeting.status === "scheduled" && onJoinMeeting && (
            <button
              onClick={() => onJoinMeeting(meeting.id)}
              className="flex-1 bg-white text-black px-4 py-2 rounded-full cursor-pointer font-medium hover:bg-gray-300    transition-colors"
            >
              Уулзалтанд орох
            </button>
          )}
          {meeting.status === "cancelled" && onCancelMeeting && (
            <button
              onClick={() => onCancelMeeting(meeting.id)}
              className="flex-1 text-white border border-white px-4 py-2 rounded-full font-medium cursor-pointer hover:bg-white/20 transition-colors"
            >
              Цуцлах
            </button>
          )}
          {!["scheduled", "cancelled"].includes(meeting.status) && (
            <div className="flex-1 text-center">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  meeting.status
                )}`}
              >
                {getStatusText(meeting.status)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MeetingCard;
