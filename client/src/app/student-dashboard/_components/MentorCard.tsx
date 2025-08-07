"use client";

import React from "react";

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

interface MentorCardProps {
  booking: Booking;
  onCancel: (bookingId: string) => void;
}

const MentorCard: React.FC<MentorCardProps> = ({ booking, onCancel }) => {
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
     <div className="bg-black/40 rounded-[20px] p-4 w-[360px] h-[220px] flex flex-col gap-8 ">
      <div className="space-y-2 text-white  ">
            <img
            src={booking.mentorId.image || "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face"}
            alt="Mentor"
            className="w-16 h-16 rounded-full object-cover"
          />
        <div className="flex flex-row gap-30">
        <p className="flex flex-col">
          <span className="text-gray-400 text-[12px]">Уулзалтын өдөр:</span> 
          <span className="font-semibold">
          </span>
          <span className="font-semibold" ></span>
        </p>
        <p className="flex flex-col">
          <span className="text-gray-400 text-[12px]">Уулзалтын цаг:</span>
          <span className="font-semibold"></span>
        </p>
        </div>
        <p className="flex flex-col">
          <span className="text-gray-400 text-[12px]">Суралцагч:</span>
         <span className="font-semibold"></span>
        </p>
      </div>
      </div>
  );
};

export default MentorCard;