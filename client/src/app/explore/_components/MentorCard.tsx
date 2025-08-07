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
      className="backdrop-blur-xl border border-gray-600/50 rounded-lg p-6 hover:bg-gray-700/50 transition-colors cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-start gap-4">
        {/* Mentor Avatar */}
        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={mentor.image}
            alt={mentor.name}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Mentor Info */}
        <div className="flex-1">
          <h3 className="text-white font-semibold text-lg mb-1">
            {mentor.name}
          </h3>
          <p className="text-gray-300 text-sm mb-2">{mentor.profession}</p>
          <p className="text-gray-400 text-sm mb-3">{mentor.experience}</p>

          {/* Category and Subcategory */}
          {(mentor.category || mentor.subCategory) && (
            <div className="mb-3">
              {mentor.category && (
                <span className="inline-block bg-blue-600/30 text-blue-300 text-xs px-2 py-1 rounded mr-2">
                  {mentor.category}
                </span>
              )}
              {/* {mentor.subCategory && (
                <span className="inline-block bg-green-600/30 text-green-300 text-xs px-2 py-1 rounded">
                  {mentor.subCategory}
                </span>
              )} */}
            </div>
          )}

          {/* Rating and Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-white text-sm font-medium">
                {mentor.rating}
              </span>
            </div>
            {mentor.hourlyPrice && (
              <span className="text-green-400 text-sm font-medium">
                {mentor.hourlyPrice.toLocaleString()}₮/цаг
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorCard;
