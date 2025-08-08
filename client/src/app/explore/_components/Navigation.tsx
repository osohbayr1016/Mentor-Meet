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
const jobCategories = [
  {
    id: 1,
    name: "Программчлал ба Технологи",
    icon: <SquareCode size={20} />,
    description: "Programming and Technology",
  },
  {
    id: 2,
    name: "Бизнес ба Менежмент",
    icon: <BriefcaseBusiness size={20} />,
    description: "Business and Management",
  },
  {
    id: 3,
    name: "Боловсрол ба Сургалт",
    icon: <Brain size={20} />,
    description: "Education and Training",
  },
  {
    id: 4,
    name: "Эрүүл мэнд ба Анагаах ухаан",
    icon: <Cross size={20} />,
    description: "Health and Medicine",
  },
  {
    id: 5,
    name: "Урлаг ба Дизайн",
    icon: <Palette size={20} />,
    description: "Arts and Design",
  },
  {
    id: 6,
    name: "Хууль ба Эрх зүй",
    icon: <Scale size={20} />,
    description: "Law and Legal",
  },
  {
    id: 7,
    name: "Сэргээгдэх эрчим хүч",
    icon: <Landmark size={20} />,
    description: "Renewable Energy",
  },
  {
    id: 8,
    name: "Хөдөө аж ахуй",
    icon: <House size={20} />,
    description: "Agriculture",
  },
  {
    id: 9,
    name: "Байгаль орчин",
    icon: <Pickaxe size={20} />,
    description: "Environment",
  },
  {
    id: 10,
    name: "Спорт ба Фитнес",
    icon: <Medal size={20} />,
    description: "Sports and Fitness",
  },
  {
    id: 11,
    name: "Мэдээлэл ба Хэвлэл",
    icon: <Mail size={20} />,
    description: "Media and Journalism",
  },
  {
    id: 12,
    name: "Тээвэр ба Логистик",
    icon: <ChartCandlestick size={20} />,
    description: "Transportation and Logistics",
  },
  {
    id: 13,
    name: "Үйлчилгээ ба Худалдаа",
    icon: <Crown size={20} />,
    description: "Services and Commerce",
  },
  {
    id: 14,
    name: "Үйлдвэрлэл ба Технологи",
    icon: <Video size={20} />,
    description: "Manufacturing and Technology",
  },
  {
    id: 15,
    name: "Барилга ба Архитектур",
    icon: <Camera size={20} />,
    description: "Construction and Architecture",
  },
];

interface NavigationProps {
  onCategoryChange?: (categoryId: string, subCategories: string[]) => void;
}

const Navigation: React.FC<NavigationProps> = ({ onCategoryChange }) => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
    <div className="w-full h-full flex flex-col">
      {/* Navigation Bar */}
      <div className="w-full flex justify-center relative pt-[40px] ">
        <div className="bg-[#737373]/50 w-[90vw] max-w-[1200px] rounded-full">
          <div className="mx-auto">
            <div className="flex items-center justify-between py-3 px-4 relative ">
              {/* All Mentors Button - Top Right */}
              <button
                onClick={handleAllMentorsClick}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 whitespace-nowrap relative flex-shrink-0 ${
                  !selectedCategory && !selectedSubCategory
                    ? "text-white font-semibold bg-gray-600/50 border"
                    : "text-white hover:bg-gray-600/50"
                }`}
              >
                <span className="text-sm font-medium">
                  {!selectedCategory && !selectedSubCategory
                    ? "✓ Бүх Ментор"
                    : "Бүх Ментор"}
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
                <div
                  ref={scrollContainerRef}
                  className="flex gap-2 overflow-x-auto scrollbar-hide"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    WebkitOverflowScrolling: "touch",
                  }}
                >
                  {categories.map((category, index) => (
                    <button
                      key={category._id}
                      onClick={() => handleCategoryClick(category._id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 whitespace-nowrap relative flex-shrink-0 ${
                        selectedCategory === category._id
                          ? "text-white font-semibold bg-black/30 "
                          : "text-white hover:bg-black/10"
                      }`}
                    >
                      <span className="text-base w-5 h-5">
                        {categoryIcons[category.categoryName] || defaultIcon}
                      </span>
                      <span className="text-sm font-medium">
                        {category.categoryName}
                        {selectedSubCategory &&
                          selectedCategory === category._id && (
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
      <div className="flex-1 px-6 pb-6 pt-6 flex items-center justify-center ">
        <div className="w-full max-w-6xl ">
          {/* Main Container - matching mentor-dashboard dimensions */}
          <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-white/20 h-[650px] w-full">
            <div className="flex gap-8 h-full">
              {/* Left Sidebar */}
              <div className="w-72 flex flex-col h-full">
                <Sidebar
                  selectedCategory={selectedCategory}
                  onSubCategorySelect={handleSubCategorySelect}
                  selectedSubCategory={selectedSubCategory}
                  categories={categories}
                />
              </div>

              {/* Right Content Area */}
              <div className="flex-1 h-full flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto">
                  <MentorCards
                    categories={categories}
                    selectedCategory={selectedCategory}
                    selectedSubCategory={selectedSubCategory}
                    onMentorClick={handleMentorClick}
                  />
                </div>
              </div>
            </div>
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
