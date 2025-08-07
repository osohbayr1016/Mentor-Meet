"use client";

import React from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  selectedTime: string; // optional болж байна, гэхдээ авсан хэвээр
  selectedTimes: string[];
  selectedTimesByDate: Record<string, string[]>;
  totalPrice: number;
  MentorId: string;
}

const BookingModal = ({
  isOpen,
  onClose,
  selectedDate,
  selectedTime,
  selectedTimes,
  selectedTimesByDate,
  totalPrice,
  MentorId,
}: Props) => {
  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed z-50 inset-0 flex items-center justify-center"
    >
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />

      {/* Modal Panel */}
      <Dialog.Panel className="relative z-50 w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <Dialog.Title className="text-lg font-semibold text-gray-800 mb-2">
          Захиалга баталгаажлаа 🎉
        </Dialog.Title>

        {/* Mentor */}
        <p className="text-sm text-gray-600 mb-2">
          Mentor ID: <span className="font-medium">{MentorId}</span>
        </p>

        {/* Times by date */}
        <div className="mb-4">
          {Object.entries(selectedTimesByDate).map(([date, times]) => (
            <div key={date} className="mb-2">
              <p className="text-sm font-medium text-gray-700">{date}</p>
              <div className="flex gap-2 flex-wrap mt-1">
                {times.map((time) => (
                  <span
                    key={time}
                    className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full"
                  >
                    {time}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Price */}
        <div className="border-t pt-3 flex justify-between text-sm text-gray-700">
          <span>Нийт төлбөр:</span>
          <span className="font-semibold">{totalPrice.toLocaleString()}₮</span>
        </div>

        {/* Button */}
        <div className="mt-5 text-center">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Ойлголоо
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};

export default BookingModal;
