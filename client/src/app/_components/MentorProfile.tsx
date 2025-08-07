// components/MentorProfile.tsx
"use client";

import Image from "next/image";
import { Star, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  mentor: any;
  totalHours: number;
  onBook: () => void;
}

const MentorProfile = ({ mentor, totalHours, onBook }: Props) => {
  const router = useRouter();

  return (
    <div className="w-1/3 p-5 flex flex-col">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-white mb-3 hover:text-gray-300 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Буцах</span>
      </button>

      <div className="flex flex-col items-center text-center mt-2">
        <div className="w-18 h-18 rounded-full overflow-hidden mb-2">
          <Image src={mentor.image} alt={mentor.firstName} width={72} height={72} className="w-full h-full object-cover" />
        </div>

        <h2 className="text-white text-base font-semibold mb-0.5">
          {mentor.firstName} {mentor.lastName}
        </h2>
        <p className="text-gray-300 text-xs mb-0.5">{mentor.profession}</p>
        <p className="text-gray-400 text-xs mb-1">Салбар: {mentor.education?.major || "Тодорхойгүй"}</p>

        <div className="flex items-center gap-1 mb-4">
          <Star className="w-3 h-3 text-yellow-400 fill-current" />
          <span className="text-white text-xs font-medium">{mentor.rating}</span>
        </div>

        <button
          onClick={onBook}
          disabled={totalHours === 0}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
        >
          Захиалга хийх ({totalHours} цаг)
        </button>
      </div>
    </div>
  );
};

export default MentorProfile;
