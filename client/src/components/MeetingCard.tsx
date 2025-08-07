"use client";

import React from "react";
import { format } from "date-fns";
import { Button } from "./ui/button";

interface Meeting {
  id: string;
  date: string;               
  day?: string;              
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
    <div className="bg-black/40 rounded-[20px] p-4 w-[360px] h-[220px] flex flex-col gap-8 ">
      <div className="space-y-2 text-white  ">
        <div className="flex flex-row gap-30">
        <p className="flex flex-col">
          <span className="text-gray-400 text-[12px]">Уулзалтын өдөр:</span> 
          <span className="font-semibold">{meeting.date}
          </span>
          <span className="font-semibold" >{meeting.day}</span>
        </p>
        <p className="flex flex-col">
          <span className="text-gray-400 text-[12px]">Уулзалтын цаг:</span>
          <span className="font-semibold"> {meeting.time}</span>
        </p>
        </div>
        <p className="flex flex-col">
          <span className="text-gray-400 text-[12px]">Суралцагч:</span>
         <span className="font-semibold"> {meeting.studentEmail}</span>
        </p>
      </div>

      {showActions && (
        <div className="flex gap-2">
          {meeting.status === "scheduled" && onJoinMeeting && (
            <div className="flex flex-row gap-2 ">
            <button
              onClick={() => onJoinMeeting(meeting.id)}
              className="  w-[210px]  bg-white text-black px-4 py-2 rounded-full cursor-pointer font-medium hover:bg-gray-300   transition-colors"
            >
              Уулзалтанд орох
            </button>
             <button className=" w-[120px] text-[#FFFFFF] border border-[#FFFFFF] px-4 py-2 rounded-full cursor-pointer font-medium   transition-colors">
              Цуцлах
             </button>
           </div>
          )}
          {meeting.status === "cancelled" && onCancelMeeting && (
            <button
              onClick={() => onCancelMeeting(meeting.id)}
              className="flex-1 text-white border border-white px-4 py-2 rounded-full font-medium cursor-pointer hover:bg-white/20 transition-colors"
            >
              Цуцлах
            </button>
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
