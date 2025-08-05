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
import { useRouter } from "next/navigation";
import axios from "axios";
import Sidebar from "./Sidebar";
import MentorCards from "./MentorCards";

// Icon mapping for categories
const categoryIcons: { [key: string]: any } = {
  "Программчлал ба Технологи": <SquareCode />,
  "Бизнес ба Менежмент": <BriefcaseBusiness />,
  "Боловсрол ба Сургалт": <Brain />,
  "Эрүүл мэнд ба Анагаах ухаан": <Cross />,
  "Урлаг ба Дизайн": <Palette />,
  "Хууль ба Эрх зүй": <Scale />,
  "Сэргээгдэх эрчим хүч": <Landmark />,
  "Хөдөө аж ахуй": <House />,
  "Байгаль орчин": <Pickaxe />,
  "Спорт ба Фитнес": <Medal />,
  "Мэдээлэл ба Хэвлэл": <Mail />,
  "Тээвэр ба Логистик": <ChartCandlestick />,
  "Үйлчилгээ ба Худалдаа": <Crown />,
  "Үйлдвэрлэл ба Технологи": <Video />,
  "Барилга ба Архитектур": <Camera />,
};

// Default fallback icon
const defaultIcon = <SquareCode />;

interface Category {
  _id: string;
  categoryName: string;
  subCategory: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface NavigationProps {
  onCategoryChange?: (categoryId: string, subCategories: string[]) => void;
}

const Navigation: React.FC<NavigationProps> = ({ onCategoryChange }) => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sliderPosition, setSliderPosition] = useState(0);
  const [sliderWidth, setSliderWidth] = useState(0);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // type Category = {
  //   _id: string;
  //   categoryName: string;
  //   subCategory: string[];
  //   createdAt: string;
  //   updatedAt: string;
  // };

  type CategoriesResponse = {
    categories: Category[];
  };
  // Fetch categor
  // ies from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);

        const response = await axios.get<CategoriesResponse>(
          "http://localhost:8000/mentor-get-category"
        );

        const categories = response.data?.categories;
        console.log(categories);
        if (Array.isArray(categories) && categories.length > 0) {
          setCategories(categories);
          // Don't auto-select first category, let user choose or show all
          setSelectedCategory(""); // Start with no category selected
        } else {
          setError("Ангилал олдсонгүй");
        }
      } catch (error: any) {
        console.error("Ангилал авахад алдаа гарлаа:", error);
        setError(
          error.response?.data?.message || "Ангилал авахад амжилтгүй боллоо"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = 300;

      container.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = 300;

      container.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const updateSliderPosition = (categoryIndex: number) => {
    const buttonElement = buttonRefs.current[categoryIndex];
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
    if (categories.length > 0 && selectedCategory) {
      const selectedIndex = categories.findIndex(
        (cat) => cat._id === selectedCategory
      );
      if (selectedIndex !== -1) {
        updateSliderPosition(selectedIndex);
      }
    }
  }, [selectedCategory, categories]);

  useEffect(() => {
    // Trigger initial category change when categories are loaded
    if (categories.length > 0 && selectedCategory && onCategoryChange) {
      const selectedCat = categories.find(
        (cat) => cat._id === selectedCategory
      );
      if (selectedCat) {
        onCategoryChange(selectedCategory, selectedCat.subCategory);
      }
    }
  }, [categories, selectedCategory, onCategoryChange]);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubCategory(""); // Reset subcategory when main category changes

    if (onCategoryChange) {
      const selectedCat = categories.find((cat) => cat._id === categoryId);
      if (selectedCat) {
        onCategoryChange(categoryId, selectedCat.subCategory);
      }
    }
  };

  const handleSubCategorySelect = (subCategory: string) => {
    setSelectedSubCategory(subCategory);
  };

  const handleAllMentorsClick = () => {
    setSelectedCategory("");
    setSelectedSubCategory("");
  };

  const handleMentorClick = (mentor: any) => {
    console.log("Mentor clicked:", mentor);
    console.log("Navigating to:", `/mentor/${mentor.id}`);
    router.push(`/mentor/${mentor.id}`);
  };

  // Get the selected category name
  const selectedCategoryName = categories.find(
    (cat) => cat._id === selectedCategory
  )?.categoryName;

  if (loading) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center">
        <div className="text-white text-lg">Loading categories...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center">
        <div className="text-red-500 text-lg">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] flex flex-col mb-40">
      {/* Navigation Bar */}
      <div className="w-full flex justify-center relative pt-[60px] py-3">
        <div className="bg-[#737373]/50 w-[90vw] max-w-[1200px] rounded-full">
          <div className="mx-auto">
            <div className="flex items-center justify-between py-3 px-4 relative">
              {/* All Mentors Button - Top Right */}
              <button
                onClick={handleAllMentorsClick}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 whitespace-nowrap relative flex-shrink-0 ${
                  !selectedCategory && !selectedSubCategory
                    ? "text-white font-semibold bg-gray-600/50 border border-blue-400/50"
                    : "text-white hover:bg-gray-600/50"
                }`}
              >
                <span className="text-sm font-medium">
                  {!selectedCategory && !selectedSubCategory ? "✓ Бүх Ментор" : "Бүх Ментор"}
                </span>
              </button>
              {/* Left Double Arrow */}
              <button
                onClick={scrollLeft}
                className="flex items-center justify-center w-8 h-8 text-white hover:bg-gray-600/50 rounded transition-colors duration-200 z-10 flex-shrink-0"
              >
                <span className="text-lg font-bold">«</span>
              </button>

              {/* Scrollable Categories */}
              <div className="flex-1 mx-3 relative overflow-hidden">
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
                  {categories.map((category, index) => (
                    <button
                      key={category._id}
                      ref={(el) => {
                        buttonRefs.current[index] = el;
                      }}
                      onClick={() => handleCategoryClick(category._id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 whitespace-nowrap relative flex-shrink-0 ${
                        selectedCategory === category._id
                          ? "text-white font-semibold"
                          : "text-white hover:bg-gray-600/50"
                      }`}
                    >
                      <span className="text-base">
                        {categoryIcons[category.categoryName] || defaultIcon}
                      </span>
                      <span className="text-sm font-medium">
                        {category.categoryName}
                        {selectedSubCategory && selectedCategory === category._id && (
                          <span className="ml-1 text-xs text-blue-300">
                            • {selectedSubCategory}
                          </span>
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Double Arrow */}
              <button
                onClick={scrollRight}
                className="flex items-center justify-center w-8 h-8 text-white hover:bg-gray-600/50 rounded transition-colors duration-200 z-10 flex-shrink-0"
              >
                <span className="text-lg font-bold">»</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area with Sidebar and Mentor Cards */}
      <div className="flex-1 px-[120px] pt-[10px]">
        <div className="w-full h-[500px] border-gray-400/50 border-1 backdrop-blur-md bg-black/20 flex rounded-[20px]">
          {/* Left Sidebar */}
          <Sidebar
            selectedCategory={selectedCategory}
            onSubCategorySelect={handleSubCategorySelect}
            selectedSubCategory={selectedSubCategory}
            categories={categories}
          />

          {/* Right Content Area */}
          <div className="flex-1 h-full flex flex-col">
            <MentorCards
                 categories={categories}
              selectedCategory={selectedCategory}
              selectedSubCategory={selectedSubCategory}
              onMentorClick={handleMentorClick}
            />
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
