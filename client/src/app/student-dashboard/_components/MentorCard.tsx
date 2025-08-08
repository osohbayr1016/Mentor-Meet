"use client";

import React from "react";
import { ExternalLink, Video, Calendar, Copy, CheckCircle } from "lucide-react";
import { useState } from "react";

interface Mentor {
  _id: string;
  firstName: string;
  lastName: string;
  image: string;
  profession: string;
  rating: number;
}

interface Booking {
  _id: string;
  mentorId: Mentor;
  date: string;
  time: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  price: number;
  category: string;
  meetingLink?: string;
  calendarEventId?: string;
  meetingStartTime?: string;
  meetingEndTime?: string;
}

interface MentorCardProps {
  booking: Booking;
  onCancel: (bookingId: string) => void;
  onGenerateTestMeetLink?: (booking: Booking) => void;
  isGeneratingMeetLink?: boolean;
}

const MentorCard: React.FC<MentorCardProps> = ({
  booking,
  onCancel,
  onGenerateTestMeetLink,
  isGeneratingMeetLink = false,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    if (booking.meetingLink) {
      try {
        await navigator.clipboard.writeText(booking.meetingLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy link:", err);
      }
    }
  };

  const handleJoinMeeting = () => {
    if (booking.meetingLink) {
      window.open(booking.meetingLink, "_blank");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "text-green-400";
      case "PENDING":
        return "text-yellow-400";
      case "CANCELLED":
        return "text-red-400";
      case "COMPLETED":
        return "text-blue-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "Батлагдсан";
      case "PENDING":
        return "Хүлээгдэж байна";
      case "CANCELLED":
        return "Цуцлагдсан";
      case "COMPLETED":
        return "Дууссан";
      default:
        return status;
    }
  };

  return (
    // <div className="bg-white rounded-xl p-6 shadow-lg w-[350px] h-[300px]">
    //         <div className="flex items-start space-x-4">
    //     <div className="flex-shrink-0">
    //       <img
    //         src={booking.mentorId.image || "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face"}
    //         alt="Mentor"
    //         className="w-16 h-16 rounded-full object-cover"
    //       />
    //     </div>
    //     <div className="flex-1">
    //       <h4 className="text-lg font-semibold text-gray-900 mb-1">
    //         {`${booking.mentorId.firstName} ${booking.mentorId.lastName}`}
    //       </h4>
    //       <p className="text-gray-600 text-sm mb-2">
    //         {booking.mentorId.profession}
    //       </p>
    //       <div className="flex items-center mb-3">
    //         <span className="text-yellow-400">★</span>
    //         <span className="text-gray-700 text-sm ml-1">{booking.mentorId.rating}</span>
    //       </div>
    //       <div className="space-y-1 text-sm text-gray-600 mb-4">
    //         <p>Уулзалтын өдөр: {new Date(booking.date).toLocaleDateString('mn-MN', {
    //           month: 'long',
    //           day: 'numeric',
    //           weekday: 'long'
    //         })}</p>
    //         <p>Уулзалтын цаг: {booking.time}</p>
    //         <p>Үнэ: {booking.price?.toLocaleString()}₮</p>
    //       </div>
    //       <button
    //         onClick={() => onCancel(booking._id)}
    //         className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
    //       >
    //         Цуцлах
    //       </button>
    //     </div>
    //   </div>
    // </div>
    <div className="bg-black/40 rounded-[20px] p-4 w-[360px] flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img
            src={
              booking.mentorId.image ||
              "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face"
            }
            alt="Mentor"
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-white">
              {`${booking.mentorId.firstName} ${booking.mentorId.lastName}`}
            </h3>
            <p className="text-gray-400 text-sm">
              {booking.mentorId.profession}
            </p>
          </div>
        </div>
        <div
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            booking.status
          )}`}
        >
          {getStatusText(booking.status)}
        </div>
      </div>

      <div className="space-y-3 text-white">
        <div className="flex flex-row gap-8">
          <p className="flex flex-col">
            <span className="text-gray-400 text-[12px]">Уулзалтын өдөр:</span>
            <span className="font-semibold">
              {new Date(booking.date).toLocaleDateString("mn-MN", {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long",
              })}
            </span>
          </p>
          <p className="flex flex-col">
            <span className="text-gray-400 text-[12px]">Уулзалтын цаг:</span>
            <span className="font-semibold">{booking.time}</span>
          </p>
        </div>

        <p className="flex flex-col">
          <span className="text-gray-400 text-[12px]">Үнэ:</span>
          <span className="font-semibold text-green-400">
            {booking.price?.toLocaleString()}₮
          </span>
        </p>
      </div>

      {/* Google Meet Section */}
      {booking.meetingLink && booking.status === "CONFIRMED" && (
        <div className="border-t border-white/20 pt-4 space-y-3">
          <div className="flex items-center gap-2 text-white">
            <Video size={16} className="text-blue-400" />
            <span className="text-sm font-medium">Google Meet уулзалт</span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleJoinMeeting}
              className="flex-1 bg-white/10 hover:bg-blue-500/20 backdrop-blur-md border border-white/20 hover:border-blue-400/40 text-white px-4 py-3 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 flex items-center justify-center gap-2"
            >
              <Video size={16} />
              Уулзалтанд орох
            </button>

            <button
              onClick={handleCopyLink}
              className="bg-white/10 hover:bg-green-500/20 backdrop-blur-md border border-white/20 hover:border-green-400/40 text-white px-4 py-3 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 flex items-center justify-center"
              title="Холбоос хуулах"
            >
              {copied ? (
                <CheckCircle size={16} className="text-green-400" />
              ) : (
                <Copy size={16} />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons - Glassmorphism Design */}
      <div className="flex gap-3 pt-4">
        {booking.status === "PENDING" && (
          <>
            <button
              onClick={() => onCancel(booking._id)}
              className="flex-1 bg-white/10 hover:bg-red-500/20 backdrop-blur-md border border-white/20 hover:border-red-400/40 text-white py-3 px-4 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10"
            >
              Цуцлах
            </button>

            {/* Join Meeting Button - Glassmorphism */}
            {onGenerateTestMeetLink && (
              <button
                onClick={() => onGenerateTestMeetLink(booking)}
                disabled={isGeneratingMeetLink}
                className="flex-1 bg-white/10 hover:bg-blue-500/20 backdrop-blur-md border border-white/20 hover:border-blue-400/40 text-white py-3 px-4 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Video size={16} />
                {isGeneratingMeetLink
                  ? "Холбогдож байна..."
                  : "Уулзалтанд орох"}
              </button>
            )}
          </>
        )}

        {booking.status === "CONFIRMED" && !booking.meetingLink && (
          <div className="flex gap-3 w-full">
            <div className="flex-1 bg-yellow-500/10 backdrop-blur-md border border-yellow-400/30 text-yellow-200 py-3 px-4 rounded-full text-sm text-center font-medium">
              Google Meet холбоос үүсгэгдэж байна...
            </div>

            {/* Join Meeting Button for confirmed bookings without links */}
            {onGenerateTestMeetLink && (
              <button
                onClick={() => onGenerateTestMeetLink(booking)}
                disabled={isGeneratingMeetLink}
                className="bg-white/10 hover:bg-blue-500/20 backdrop-blur-md border border-white/20 hover:border-blue-400/40 text-white py-3 px-4 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Video size={16} />
                {isGeneratingMeetLink
                  ? "Холбогдож байна..."
                  : "Уулзалтанд орох"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorCard;
