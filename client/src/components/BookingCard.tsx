"use client";

import React from "react";
import Image from "next/image";

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
}

interface BookingCardProps {
  booking: Booking;
  onJoinMeeting?: (bookingId: string) => void;
  onCancelBooking?: (bookingId: string) => void;
  showActions?: boolean;
}

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onJoinMeeting,
  onCancelBooking,
  showActions = true,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayNames = ["Ням", "Да", "Мя", "Лх", "Пү", "Ба", "Бя"];
    const dayName = dayNames[date.getDay()];
    return `${month} сарын ${day}, ${dayName} гараг`;
  };

  const getStatusText = (status: Booking["status"]) => {
    switch (status) {
      case "PENDING":
        return "Хүлээгдэж буй";
      case "CONFIRMED":
        return "Баталгаажсан";
      case "CANCELLED":
        return "Цуцлагдсан";
      case "COMPLETED":
        return "Дууссан";
      default:
        return "";
    }
  };

  const getStatusColor = (status: Booking["status"]) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-600/20 text-yellow-400";
      case "CONFIRMED":
        return "bg-green-600/20 text-green-400";
      case "CANCELLED":
        return "bg-red-600/20 text-red-400";
      case "COMPLETED":
        return "bg-blue-600/20 text-blue-400";
      default:
        return "";
    }
  };

  return (
    <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600 h-[300px]">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 bg-gray-300 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={booking.mentorId.image || "https://via.placeholder.com/64"}
            alt={`${booking.mentorId.firstName} ${booking.mentorId.lastName}`}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold text-lg mb-1">
            {booking.mentorId.firstName} {booking.mentorId.lastName}
          </h3>
          <p className="text-white/70 text-sm mb-2">
            {booking.mentorId.profession}
          </p>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-white/80">Ангилал: {booking.category}</span>
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-white">{booking.mentorId.rating}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 text-white mb-4">
        <p>
          <span className="text-gray-400">Уулзалтын өдөр:</span>{" "}
          {formatDate(booking.date)}
        </p>
        <p>
          <span className="text-gray-400">Уулзалтын цаг:</span> {booking.time}
        </p>
        <p>
          <span className="text-gray-400">Үнэ:</span>{" "}
          {booking.price.toLocaleString()}₮
        </p>
      </div>

      {showActions && (
        <div className="flex gap-2">
          {booking.status === "CONFIRMED" && onJoinMeeting && (
            <button
              onClick={() => onJoinMeeting(booking._id)}
              className="flex-1 bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Уулзалтанд орох
            </button>
          )}
          {booking.status === "PENDING" && onCancelBooking && (
            <button
              onClick={() => onCancelBooking(booking._id)}
              className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-500 transition-colors"
            >
              Цуцлах
            </button>
          )}
          {!["CONFIRMED", "PENDING"].includes(booking.status) && (
            <div className="flex-1 text-center">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  booking.status
                )}`}
              >
                {getStatusText(booking.status)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingCard;
