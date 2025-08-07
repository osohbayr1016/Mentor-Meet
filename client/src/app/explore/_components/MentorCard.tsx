import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";

interface MentorCardProps {
  mentor: {
    id: string;
    name: string;
    profession: string;
    experience: string;
    rating: number;
    image: string;
    category?: string;
    subCategory?: string;
    hourlyPrice?: number;
  };
  onClick?: () => void;
}

const MentorCard: React.FC<MentorCardProps> = ({ mentor, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className="backdrop-blur-xl border border-gray-600/50 rounded-[20px] p-2 hover:bg-gray-700/50 transition-colors cursor-pointer w-[420px] h-[160px]"
      onClick={handleClick}
    >
      <div className="flex items-start gap-4">
        {/* Mentor Avatar */}
        <div className="w-[136px] h-[144px] rounded-lg overflow-hidden ">
          <Image
            src={mentor.image}
            alt={mentor.name}
            width={136}
            height={144}
            className="w-full h-full object-cover rounded-[20px]"
          />
        </div>

        {/* Mentor Info */}
        <div className="flex-1  flex flex-col gap-15 ">
          <div>
            <h3 className="text-white font-semibold text-[16px] mb-1">
              {mentor.name}
            </h3>
            <p className="text-white font-semibold text-[16px] mb-1">
              {mentor.profession}
            </p>
          </div>
          <div className="flex flex-row justify-between pb-1 pr-[10px] ">
            <p className="text-white font-semibold text-[16px] mb-1">
              {mentor.experience} жил
            </p>
            <div className="flex items-center justify-between"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorCard;
