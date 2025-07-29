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
import { useState, useRef, useEffect } from "react";

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
  const [sliderPosition, setSliderPosition] = useState(0);
  const [sliderWidth, setSliderWidth] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

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

  const updateSliderPosition = (categoryId: number) => {
    const buttonElement = buttonRefs.current[categoryId - 1];
    if (buttonElement) {
      const containerRect = scrollContainerRef.current?.getBoundingClientRect();
      const buttonRect = buttonElement.getBoundingClientRect();

      if (containerRect) {
        const relativeLeft = buttonRect.left - containerRect.left;
        const buttonWidth = buttonRect.width;

        setSliderPosition(relativeLeft);
        setSliderWidth(buttonWidth);
      }
    }
  };

  useEffect(() => {
    updateSliderPosition(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    // Initial position
    updateSliderPosition(selectedCategory);
  }, []);

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className=" w-screen flex justify-center relative">
      {/* Top Navigation Bar - EXACTLY like the image */}
      <div className="bg-[#737373]/50 absolute top-10 overflow-x-auto w-4xl rounded-full">
        <div className=" mx-auto">
          <div className="flex items-center justify-between py-3 px-4 relative">
            {/* Left Double Arrow */}
            <button
              onClick={scrollLeft}
              className="flex items-center justify-center w-8 h-8 text-white hover:bg-gray-600 rounded transition-colors duration-200 z-10"
            >
              <span className="text-lg font-bold">«</span>
            </button>

            {/* Scrollable Categories */}
            <div className="flex-1 mx-3 relative">
              {/* Gray Selected Background */}
              <div
                className="absolute top-0 left-0 h-full bg-gray-600/40 rounded-lg transition-all duration-700 ease-out"
                style={{
                  left: `${sliderPosition}px`,
                  width: `${sliderWidth}px`,
                  filter: "blur(0.5px)",
                }}
              />

              <div
                ref={scrollContainerRef}
                className="flex gap-2 overflow-x-auto scrollbar-hide relative z-10"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {jobCategories.map((category, index) => (
                  <button
                    key={category.id}
                    ref={(el) => {
                      buttonRefs.current[index] = el;
                    }}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 whitespace-nowrap relative ${
                      selectedCategory === category.id
                        ? "text-white font-semibold"
                        : "text-white hover:bg-gray-600/50"
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
              className="flex items-center justify-center w-8 h-8 text-white hover:bg-gray-600 rounded transition-colors duration-200 z-10"
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

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar-track {
          display: none;
        }

        .scrollbar-hide::-webkit-scrollbar-thumb {
          display: none;
        }

        .scrollbar-hide::-webkit-scrollbar-corner {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Navigation;
