"use client";

import { FC } from "react";
import { format } from "date-fns";
import { MeetingCard } from "../../components/MeetingCard"; // ✅ named export ашиглаж байгаа бол ингэж оруулна
import { Meeting } from "@/app/types/mentor";

interface MeetingListProps {
  meetings: Meeting[];
  activeTab: "scheduled" | "history";
  onJoinMeeting?: (meetingId: string) => void;
  onCancelMeeting?: (meetingId: string) => void;
}

const MeetingList: FC<MeetingListProps> = ({
  meetings,
  activeTab,
  onJoinMeeting,
  onCancelMeeting,
}) => {
  return (
    <div className="flex-1 flex flex-col">
      <h3 className="text-white text-lg font-semibold mb-4">
        {activeTab === "scheduled"
          ? "Таны товлосон уулзалтууд:"
          : "Уулзалтын түүх:"}
      </h3>

      {meetings.length === 0 ? (
        <div className="text-gray-300 text-center">Уулзалт олдсонгүй</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {meetings.map((meeting, index) => {
            // ✨ day байхгүй бол date-оос weekday-ийг гаргаж авна
            const ensuredDay =
              meeting.day || format(new Date(meeting.date), "EEEE");

            // ✨ шинэчилсэн объект
            const updatedMeeting: Meeting = {
              ...meeting,
              day: ensuredDay,
            };

            return (
              <MeetingCard
                key={meeting.id || `meeting-${index}`}
                meeting={updatedMeeting}
                showActions={activeTab === "scheduled"}
                onJoinMeeting={
                  activeTab === "scheduled" ? onJoinMeeting : undefined
                }
                onCancelMeeting={
                  activeTab === "scheduled" ? onCancelMeeting : undefined
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MeetingList;
