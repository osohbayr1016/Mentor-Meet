// components/MentorDetails.tsx
"use client";

import MentorCalendar from "@/components/MentorCalendar";

interface CalendarSlot {
  _id: string;
  date: string;
  times: string[];
}

interface Mentor {
  firstName: string;
  lastName: string;
  bio: string;
  hourlyPrice: number;
  experience?: {
    careerDuration?: string;
  };
  education?: {
    schoolName?: string;
  };
  id?: string;
  _id?: string;
}

interface Props {
  mentor: Mentor;
  calendar: CalendarSlot[];
  selectedTimesByDate: Record<string, string[]>;
  onTimeSelect: (date: string, time: string) => void;
  totalHours: number;
  totalPrice: number;
  refreshCalendar?: number;
  mentorAvailability?: Record<string, string[]>;
}

const MentorDetails = ({
  mentor,
  calendar,
  selectedTimesByDate,
  onTimeSelect,
  totalHours,
  totalPrice,
  refreshCalendar,
  mentorAvailability = {},
}: Props) => {
  return (
    <div className="w-2/3 p-5 flex flex-col">
      <div className="flex-1 flex flex-col gap-3">
        {/* Experience + Education */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-white/10 rounded-lg p-2.5">
            <h3 className="text-white font-medium mb-1 text-sm">Туршлага</h3>
            <p className="text-gray-300 text-xs">
              {mentor.experience?.careerDuration || "Тодорхойгүй"}
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-2.5">
            <h3 className="text-white font-medium mb-1 text-sm">
              Төгссөн сургууль
            </h3>
            <p className="text-gray-300 text-xs">
              {mentor.education?.schoolName || "Тодорхойгүй"}
            </p>
          </div>
        </div>

        {/* Bio */}
        <div className="bg-white/10 rounded-lg p-2.5 mb-3">
          <h3 className="text-white font-medium mb-1 text-sm">Танилцуулга</h3>
          <p className="text-gray-300 text-xs leading-relaxed">{mentor.bio}</p>
        </div>

        {/* Calendar */}
        <div className="bg-white/10 rounded-lg p-2.5 mb-3">
          <h3 className="text-white font-medium mb-3 text-sm">Хуваарь</h3>
          <MentorCalendar
            key={refreshCalendar} // Force re-render when refreshCalendar changes
            mentorId={mentor._id || mentor.id}
            onTimeSelect={onTimeSelect}
            selectedTimesByDate={selectedTimesByDate}
            mentorAvailability={mentorAvailability}
            refreshToken={refreshCalendar}
            onBookingComplete={() => {
              // Refresh calendar after booking completion
              console.log("Booking completed, calendar will refresh");
            }}
          />
        </div>

        {/* Price */}
        <div className="bg-white/10 rounded-lg p-2.5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-medium text-sm">Цагийн үнэ:</span>
            <span className="text-white font-semibold text-base">
              {mentor.hourlyPrice.toLocaleString()}₮
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white font-medium text-sm">
              Уулзалтын үнэ ({totalHours} цаг):
            </span>
            <span className="text-white font-semibold text-base">
              {totalPrice.toLocaleString()}₮
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDetails;
