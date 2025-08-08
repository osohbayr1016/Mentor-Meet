"use client";

import { useState } from "react";

interface TimeSlotStatusProps {
  time: string;
  date: string;
  isDisabled: boolean;
  isSelected: boolean;
  onClick: () => void;
  disabledReason?: string;
  isBooked?: boolean;
}

export default function TimeSlotStatus({
  time,
  date,
  isDisabled,
  isSelected,
  onClick,
  disabledReason = "Энэ цаг захиалагдсан эсвэл өнгөрсөн",
  isBooked = false,
}: TimeSlotStatusProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const getButtonClasses = () => {
    if (isBooked) {
      return "text-white border-red-500";
    }
    if (isDisabled) {
      return "bg-gray-600 text-gray-400 border-gray-600 cursor-not-allowed opacity-50";
    }
    if (isSelected) {
      return "bg-white text-black border-white";
    }
    return "text-white border-white hover:bg-white/10";
  };

  const getTooltipContent = () => {
    if (isDisabled) {
      return disabledReason || "Энэ цаг захиалагдсан эсвэл өнгөрсөн";
    }
    if (isSelected) {
      return "Сонгосон цаг - дарах нь цуцлах";
    }
    return "Энэ цагийг сонгох";
  };

  return (
    <div className="relative">
      <button
        onClick={onClick}
        disabled={isDisabled}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`px-2 py-1.5 rounded-lg border text-xs transition-colors ${getButtonClasses()}`}
      >
        {time}
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap z-10">
          {getTooltipContent()}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
        </div>
      )}
    </div>
  );
}
