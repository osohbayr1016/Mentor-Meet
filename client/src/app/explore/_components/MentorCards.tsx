import React, { useState, useEffect } from "react";
import MentorCard from "./MentorCard";

interface Mentor {
  id: string;
  name: string;
  profession: string;
  experience: string;
  rating: number;
  image: string;
  category?: string;
  subCategory?: string;
  hourlyPrice?: number;
}

interface MentorCardsProps {
  selectedCategory?: string;
  selectedSubCategory?: string;
  onMentorClick?: (mentor: Mentor) => void;
}

const MentorCards: React.FC<MentorCardsProps> = ({
  selectedCategory,
  selectedSubCategory,
  onMentorClick,
}) => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Set mounted state on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch mentors from API
  useEffect(() => {
    if (!mounted) return;

    const fetchMentors = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query parameters
        const params = new URLSearchParams();
        if (selectedCategory) params.append("category", selectedCategory);
        if (selectedSubCategory)
          params.append("subCategory", selectedSubCategory);

        const response = await fetch(`/api/get-mentors?${params.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to fetch mentors");
        }

        const data = await response.json();
        setMentors(data);
      } catch (err) {
        console.error("Error fetching mentors:", err);
        setError("Failed to load mentors");
        // Fallback to sample data for development
        setMentors(getSampleMentors());
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, [mounted, selectedCategory, selectedSubCategory]);
  // Sample mentors data for fallback
  const getSampleMentors = (): Mentor[] => [
    // Программчлал ба Технологи - Web Development
    {
      id: "1",
      name: "Ч. Энхжин",
      profession: "Эмч, Нийгмийн эрүүл мэндийн судлаач",
      experience: "Туршлага: 8 жил",
      rating: 4.9,
      image: "/image709.png",
      category: "Программчлал ба Технологи",
      subCategory: "Web Development",
    },
    {
      id: "2",
      name: "Б. Сүхбат",
      profession: "Эмч, Нийгмийн эрүүл мэндийн судлаач",
      experience: "Туршлага: 5 жил",
      rating: 4.7,
      image: "/image709.png",
      category: "Программчлал ба Технологи",
      subCategory: "Web Development",
    },
    // Программчлал ба Технологи - Mobile Development
    {
      id: "3",
      name: "Д. Батбаяр",
      profession: "Эмч, Нийгмийн эрүүл мэндийн судлаач",
      experience: "Туршлага: 6 жил",
      rating: 4.8,
      image: "/image709.png",
      category: "Программчлал ба Технологи",
      subCategory: "Mobile Development",
    },
    {
      id: "4",
      name: "Л. Мөнхбат",
      profession: "Эмч, Нийгмийн эрүүл мэндийн судлаач",
      experience: "Туршлага: 4 жил",
      rating: 4.6,
      image: "/image709.png",
      category: "Программчлал ба Технологи",
      subCategory: "Mobile Development",
    },
    // Бизнес ба Менежмент - Business Strategy
    {
      id: "5",
      name: "Н. Алтанцэцэг",
      profession: "Эмч, Нийгмийн эрүүл мэндийн судлаач",
      experience: "Туршлага: 10 жил",
      rating: 4.9,
      image: "/image709.png",
      category: "Бизнес ба Менежмент",
      subCategory: "Business Strategy",
    },
    {
      id: "6",
      name: "П. Батсүх",
      profession: "Эмч, Нийгмийн эрүүл мэндийн судлаач",
      experience: "Туршлага: 7 жил",
      rating: 4.8,
      image: "/image709.png",
      category: "Бизнес ба Менежмент",
      subCategory: "Business Strategy",
    },
    // Бизнес ба Менежмент - Project Management
    {
      id: "7",
      name: "Р. Дэлгэрмаа",
      profession: "Эмч, Нийгмийн эрүүл мэндийн судлаач",
      experience: "Туршлага: 9 жил",
      rating: 4.7,
      image: "/image709.png",
      category: "Бизнес ба Менежмент",
      subCategory: "Project Management",
    },
    {
      id: "8",
      name: "С. Батзориг",
      profession: "Эмч, Нийгмийн эрүүл мэндийн судлаач",
      experience: "Туршлага: 6 жил",
      rating: 4.6,
      image: "/image709.png",
      category: "Бизнес ба Менежмент",
      subCategory: "Project Management",
    },
    // Боловсрол ба Сургалт - Teaching Methods
    {
      id: "9",
      name: "Т. Оюунчимэг",
      profession: "Эмч, Нийгмийн эрүүл мэндийн судлаач",
      experience: "Туршлага: 12 жил",
      rating: 4.9,
      image: "/image709.png",
      category: "Боловсрол ба Сургалт",
      subCategory: "Teaching Methods",
    },
    {
      id: "10",
      name: "У. Батбаатар",
      profession: "Эмч, Нийгмийн эрүүл мэндийн судлаач",
      experience: "Туршлага: 8 жил",
      rating: 4.8,
      image: "/image709.png",
      category: "Боловсрол ба Сургалт",
      subCategory: "Teaching Methods",
    },
    // Эрүүл мэнд ба Анагаах ухаан - Clinical Practice
    {
      id: "11",
      name: "Ф. Энхтуяа",
      profession: "Эмч, Нийгмийн эрүүл мэндийн судлаач",
      experience: "Туршлага: 15 жил",
      rating: 4.9,
      image: "/image709.png",
      category: "Эрүүл мэнд ба Анагаах ухаан",
      subCategory: "Clinical Practice",
    },
    {
      id: "12",
      name: "Х. Батбаатар",
      profession: "Эмч, Нийгмийн эрүүл мэндийн судлаач",
      experience: "Туршлага: 11 жил",
      rating: 4.8,
      image: "/image709.png",
      category: "Эрүүл мэнд ба Анагаах ухаан",
      subCategory: "Clinical Practice",
    },
    // Урлаг ба Дизайн - Graphic Design
    {
      id: "13",
      name: "Ц. Мөнхзул",
      profession: "Эмч, Нийгмийн эрүүл мэндийн судлаач",
      experience: "Туршлага: 9 жил",
      rating: 4.7,
      image: "/image709.png",
      category: "Урлаг ба Дизайн",
      subCategory: "Graphic Design",
    },
    {
      id: "14",
      name: "Ш. Батбаатар",
      profession: "Эмч, Нийгмийн эрүүл мэндийн судлаач",
      experience: "Туршлага: 7 жил",
      rating: 4.6,
      image: "/image709.png",
      category: "Урлаг ба Дизайн",
      subCategory: "Graphic Design",
    },
    // Хууль ба Эрх зүй - Corporate Law
    {
      id: "15",
      name: "Э. Батбаатар",
      profession: "Эмч, Нийгмийн эрүүл мэндийн судлаач",
      experience: "Туршлага: 13 жил",
      rating: 4.9,
      image: "/image709.png",
      category: "Хууль ба Эрх зүй",
      subCategory: "Corporate Law",
    },
    {
      id: "16",
      name: "Ю. Энхтуяа",
      profession: "Эмч, Нийгмийн эрүүл мэндийн судлаач",
      experience: "Туршлага: 10 жил",
      rating: 4.8,
      image: "/image709.png",
      category: "Хууль ба Эрх зүй",
      subCategory: "Corporate Law",
    },
  ];

  // Filter mentors based on category and subcategory (if needed for additional filtering)
  // For now, show all mentors since many don't have proper category assignments
  const filteredMentors = mentors.filter((mentor: Mentor) => {
    // If no category is selected, show all mentors
    if (!selectedCategory) {
      return true;
    }

    // If category is selected, show mentors that match or have unknown category
    const matchesCategory =
      mentor.category === selectedCategory || mentor.category === "Тодорхойгүй";
    const matchesSubCategory =
      !selectedSubCategory || mentor.subCategory === selectedSubCategory;
    return matchesCategory && matchesSubCategory;
  });

  return (
    <div className="flex-1 h-full flex flex-col">
      {/* Fixed Title */}
      <div className="p-6 pb-4 flex-shrink-0">
        <h1 className="text-white text-3xl font-bold">
          Менторуудтайгаа танилцана уу!
        </h1>
        {selectedCategory && (
          <p className="text-gray-300 text-sm mt-2">
            {selectedCategory}{" "}
            {selectedSubCategory && `• ${selectedSubCategory}`}
          </p>
        )}
      </div>

      {/* Scrollable Mentor Cards Area */}
      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-8 h-8 border border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Уншиж байна...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-red-400 text-lg mb-2">{error}</p>
              <p className="text-gray-500 text-sm">Дахин оролдоно уу</p>
            </div>
          </div>
        ) : filteredMentors.length > 0 ? (
          <div className="grid grid-cols-2 gap-6">
            {filteredMentors.map((mentor: Mentor) => (
              <MentorCard
                key={mentor.id}
                mentor={mentor}
                onClick={() => onMentorClick?.(mentor)}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-400 text-lg mb-2">Ментор олдсонгүй</p>
              <p className="text-gray-500 text-sm">
                Өөр хайлтын нөхцөл сонгоно уу
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorCards;
