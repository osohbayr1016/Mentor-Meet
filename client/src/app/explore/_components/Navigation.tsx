"use client";

import {
  Brain,
  BriefcaseBusiness,
  Camera,
  ChartCandlestick,
  Cross,
  Crown,
  HandPlatter,
  House,
  Landmark,
  Mail,
  Medal,
  Music,
  Palette,
  Pickaxe,
  Scale,
  SquareCode,
  Video,
} from "lucide-react";
import { useState, useRef } from "react";

const jobCategories = [
  {
    id: 1,
    name: "Программчлал ба Технологи",
    icon: <SquareCode />,
    description: "Programming and Technology",
  },
  {
    id: 2,
    name: "Хууль, эрх зүй",
    icon: <Scale />,
    description: "Law and Jurisprudence",
  },
  {
    id: 3,
    name: "Эрүүл мэнд",
    icon: <Cross />,
    description: "Health",
  },
  {
    id: 4,
    name: "График ба Дизайн",
    icon: <Palette />,
    description: "Graphics and Design",
  },
  {
    id: 5,
    name: "Спорт",
    icon: <Medal />,
    description: "Sport",
  },
  {
    id: 6,
    name: "Бизнес",
    icon: <BriefcaseBusiness />,
    description: "Business",
  },
  {
    id: 7,
    name: "Санхүү",
    icon: <Landmark />,
    description: "Finance",
  },
  {
    id: 8,
    name: "Хөгжим ба Аудио",
    icon: <Music />,
    description: "Music and Audio",
  },
  {
    id: 9,
    name: "Маркетинг, Борлуулалт",
    icon: <ChartCandlestick />,
    description: "Marketing, Sales",
  },
  {
    id: 10,
    name: "Удирдлага, Хүний нөөц",
    icon: <Crown />,
    description: "Administration, Human Resources",
  },
  {
    id: 11,
    name: "Харилцаа, Мэйл",
    icon: <Mail />,
    description: "Communication, Mail",
  },
  {
    id: 12,
    name: "Боловсрол, Шинжлэх ухаан",
    icon: <Brain />,
    description: "Education, Science",
  },
  {
    id: 13,
    name: "Барилга, Үл хөдлөх хөрөнгө",
    icon: <House />,
    description: "Construction, Real Estate",
  },
  {
    id: 14,
    name: "Уул уурхай",
    icon: <Pickaxe />,
    description: "Mining",
  },
  {
    id: 15,
    name: "Жуулчлал, Хүнсний үйлдвэр",
    icon: <HandPlatter />,
    description: "Tourism, Food Industry",
  },
  {
    id: 16,
    name: "Видео ба Анимэйшн",
    icon: <Video />,
    description: "Video and Animation",
  },
  {
    id: 17,
    name: "Гэрэл зураг",
    icon: <Camera />,
    description: "Photography",
  },
];

const Navigation = () => {
  const [selectedCategory, setSelectedCategory] = useState(1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className=" w-screen flex justify-center ">
      {/* Top Navigation Bar - EXACTLY like the image */}
      <div className="bg-[#737373]/50 overflow-x-auto w-4xl rounded-full">
        <div className=" mx-auto">
          <div className="flex items-center justify-between py-3 px-4">
            {/* Left Double Arrow */}
            <button
              onClick={scrollLeft}
              className="flex items-center justify-center w-8 h-8 text-white hover:bg-gray-600 rounded transition-colors duration-200"
            >
              <span className="text-lg font-bold">«</span>
            </button>

            {/* Scrollable Categories */}
            <div className="flex-1 mx-3">
              <div
                ref={scrollContainerRef}
                className="flex gap-2 overflow-x-auto scrollbar-hide"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {jobCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                      selectedCategory === category.id
                        ? "bg-black/30 text-white shadow-md"
                        : "text-white hover:bg-gray-600"
                    }`}
                  >
                    <span className="text-base">{category.icon}</span>
                    <span className="text-sm font-medium">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Double Arrow */}
            <button
              onClick={scrollRight}
              className="flex items-center justify-center w-8 h-8 text-white hover: rounded transition-colors duration-200"
            >
              <span className="text-lg font-bold">»</span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Navigation;
