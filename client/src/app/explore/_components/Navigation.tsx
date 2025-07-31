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
import Sidebar from "./Sidebar";
import MentorCards from "./MentorCards";

// Subcategories for each main category
const subCategories = {
  1: [
    // Программчлал ба Технологи
    "Web Development",
    "Mobile Development",
    "Data Science",
    "Artificial Intelligence",
    "Cybersecurity",
    "DevOps",
    "UI/UX Design",
    "Database Management",
    "Cloud Computing",
    "Machine Learning",
  ],
  2: [
    // Бизнес ба Менежмент
    "Business Strategy",
    "Project Management",
    "Marketing",
    "Sales",
    "Finance",
    "Human Resources",
    "Operations",
    "Leadership",
    "Entrepreneurship",
    "Consulting",
  ],
  3: [
    // Боловсрол ба Сургалт
    "Teaching Methods",
    "Curriculum Development",
    "Student Assessment",
    "Educational Technology",
    "Special Education",
    "Language Teaching",
    "Online Education",
    "Academic Writing",
    "Research Methods",
    "Educational Leadership",
  ],
  4: [
    // Эрүүл мэнд ба Анагаах ухаан
    "Clinical Practice",
    "Medical Research",
    "Public Health",
    "Nursing",
    "Pharmacy",
    "Mental Health",
    "Emergency Medicine",
    "Pediatrics",
    "Surgery",
    "Preventive Medicine",
  ],
  5: [
    // Урлаг ба Дизайн
    "Graphic Design",
    "Web Design",
    "Illustration",
    "Photography",
    "Digital Art",
    "Branding",
    "Typography",
    "Animation",
    "3D Modeling",
    "User Experience Design",
  ],
  6: [
    // Хууль ба Эрх зүй
    "Corporate Law",
    "Criminal Law",
    "Civil Law",
    "International Law",
    "Constitutional Law",
    "Environmental Law",
    "Intellectual Property",
    "Tax Law",
    "Family Law",
    "Labor Law",
  ],
  7: [
    // Сэргээгдэх эрчим хүч
    "Solar Energy",
    "Wind Energy",
    "Hydroelectric Power",
    "Biomass Energy",
    "Geothermal Energy",
    "Energy Storage",
    "Smart Grid",
    "Energy Policy",
    "Green Building",
    "Carbon Reduction",
  ],
  8: [
    // Хөдөө аж ахуй
    "Crop Management",
    "Livestock Farming",
    "Organic Farming",
    "Agricultural Technology",
    "Soil Science",
    "Pest Management",
    "Irrigation Systems",
    "Agricultural Economics",
    "Food Safety",
    "Sustainable Agriculture",
  ],
  9: [
    // Байгаль орчин
    "Environmental Science",
    "Climate Change",
    "Conservation",
    "Waste Management",
    "Air Quality",
    "Water Resources",
    "Biodiversity",
    "Environmental Policy",
    "Green Technology",
    "Sustainability",
  ],
  10: [
    // Спорт ба Фитнес
    "Personal Training",
    "Sports Coaching",
    "Nutrition",
    "Physical Therapy",
    "Athletic Performance",
    "Sports Psychology",
    "Injury Prevention",
    "Strength Training",
    "Cardiovascular Fitness",
    "Flexibility Training",
  ],
  11: [
    // Мэдээлэл ба Хэвлэл
    "Journalism",
    "Content Writing",
    "Digital Media",
    "Broadcasting",
    "Public Relations",
    "Social Media",
    "Video Production",
    "Podcasting",
    "News Reporting",
    "Media Ethics",
  ],
  12: [
    // Тээвэр ба Логистик
    "Supply Chain Management",
    "Logistics",
    "Transportation",
    "Warehouse Management",
    "Inventory Control",
    "Freight Forwarding",
    "Route Optimization",
    "Fleet Management",
    "Import/Export",
    "Last Mile Delivery",
  ],
  13: [
    // Үйлчилгээ ба Худалдаа
    "Customer Service",
    "Retail Management",
    "E-commerce",
    "Hospitality",
    "Tourism",
    "Event Planning",
    "Food Service",
    "Beauty Services",
    "Real Estate",
    "Financial Services",
  ],
  14: [
    // Үйлдвэрлэл ба Технологи
    "Manufacturing",
    "Quality Control",
    "Process Improvement",
    "Industrial Engineering",
    "Automation",
    "Robotics",
    "3D Printing",
    "Lean Manufacturing",
    "Supply Chain",
    "Product Development",
  ],
  15: [
    // Барилга ба Архитектур
    "Architectural Design",
    "Construction Management",
    "Structural Engineering",
    "Interior Design",
    "Urban Planning",
    "Building Codes",
    "Project Planning",
    "Cost Estimation",
    "Sustainability",
    "Renovation",
  ],
};

const jobCategories = [
  {
    id: 1,
    name: "Программчлал ба Технологи",
    icon: <SquareCode />,
    description: "Programming and Technology",
  },
  {
    id: 2,
    name: "Бизнес ба Менежмент",
    icon: <BriefcaseBusiness />,
    description: "Business and Management",
  },
  {
    id: 3,
    name: "Боловсрол ба Сургалт",
    icon: <Brain />,
    description: "Education and Training",
  },
  {
    id: 4,
    name: "Эрүүл мэнд ба Анагаах ухаан",
    icon: <Cross />,
    description: "Health and Medicine",
  },
  {
    id: 5,
    name: "Урлаг ба Дизайн",
    icon: <Palette />,
    description: "Arts and Design",
  },
  {
    id: 6,
    name: "Хууль ба Эрх зүй",
    icon: <Scale />,
    description: "Law and Legal",
  },
  {
    id: 7,
    name: "Сэргээгдэх эрчим хүч",
    icon: <Landmark />,
    description: "Renewable Energy",
  },
  { id: 8, name: "Хөдөө аж ахуй", icon: <House />, description: "Agriculture" },
  {
    id: 9,
    name: "Байгаль орчин",
    icon: <Pickaxe />,
    description: "Environment",
  },
  {
    id: 10,
    name: "Спорт ба Фитнес",
    icon: <Medal />,
    description: "Sports and Fitness",
  },
  {
    id: 11,
    name: "Мэдээлэл ба Хэвлэл",
    icon: <Mail />,
    description: "Media and Journalism",
  },
  {
    id: 12,
    name: "Тээвэр ба Логистик",
    icon: <ChartCandlestick />,
    description: "Transportation and Logistics",
  },
  {
    id: 13,
    name: "Үйлчилгээ ба Худалдаа",
    icon: <Crown />,
    description: "Services and Commerce",
  },
  {
    id: 14,
    name: "Үйлдвэрлэл ба Технологи",
    icon: <Video />,
    description: "Manufacturing and Technology",
  },
  {
    id: 15,
    name: "Барилга ба Архитектур",
    icon: <Camera />,
    description: "Construction and Architecture",
  },
];

interface NavigationProps {
  onCategoryChange?: (categoryId: number, subCategories: string[]) => void;
}

const Navigation: React.FC<NavigationProps> = ({ onCategoryChange }) => {
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [sliderPosition, setSliderPosition] = useState(0);
  const [sliderWidth, setSliderWidth] = useState(0);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = 300; // Increased scroll amount for better visibility

      container.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = 300; // Increased scroll amount for better visibility

      container.scrollBy({
        left: scrollAmount,
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
    // Trigger initial category change
    if (onCategoryChange) {
      onCategoryChange(
        selectedCategory,
        subCategories[selectedCategory as keyof typeof subCategories] || []
      );
    }
  }, []);

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategory(categoryId);
    setSelectedSubCategory(""); // Reset subcategory when main category changes
    if (onCategoryChange) {
      onCategoryChange(
        categoryId,
        subCategories[categoryId as keyof typeof subCategories] || []
      );
    }
  };

  const handleSubCategorySelect = (subCategory: string) => {
    setSelectedSubCategory(subCategory);
  };

  const handleMentorClick = (mentor: any) => {
    console.log("Mentor clicked:", mentor);
    // Handle mentor click - you can navigate to mentor detail page or open modal
  };

  // Get the selected category name
  const selectedCategoryName = jobCategories.find(
    (cat) => cat.id === selectedCategory
  )?.name;

  return (
    <div className="w-full h-[600px] flex flex-col">
      {/* Navigation Bar */}
      <div className="w-full flex justify-center relative pt-[120px]">
        <div className="bg-[#737373]/50 w-[90vw] max-w-[1200px] rounded-full">
          <div className="mx-auto">
            <div className="flex items-center justify-between py-3 px-4 relative">
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
                  {jobCategories.map((category, index) => (
                    <button
                      key={category.id}
                      ref={(el) => {
                        buttonRefs.current[index] = el;
                      }}
                      onClick={() => handleCategoryClick(category.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 whitespace-nowrap relative flex-shrink-0 ${
                        selectedCategory === category.id
                          ? "text-white font-semibold"
                          : "text-white hover:bg-gray-600/50"
                      }`}
                    >
                      <span className="text-base">{category.icon}</span>
                      <span className="text-sm font-medium">
                        {category.name}
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
      <div className="flex-1 px-[150px] pt-[30px]">
        <div className="w-full h-[500px] border-gray-400/50 border-1 backdrop-blur-md bg-black/20 flex rounded-[20px]">
          {/* Left Sidebar */}
          <Sidebar
            selectedCategory={selectedCategory}
            onSubCategorySelect={handleSubCategorySelect}
            selectedSubCategory={selectedSubCategory}
          />

          {/* Right Content Area */}
          <div className="flex-1 h-full flex flex-col">
            <MentorCards
              selectedCategory={selectedCategoryName}
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
