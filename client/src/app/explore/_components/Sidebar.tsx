import React from "react";
import { Search } from "lucide-react";

interface SidebarProps {
  selectedCategory?: number;
  onSubCategorySelect?: (subCategory: string) => void;
  selectedSubCategory?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedCategory = 1,
  onSubCategorySelect,
  selectedSubCategory,
}) => {
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

  const currentSubCategories =
    subCategories[selectedCategory as keyof typeof subCategories] || [];

  const handleSubCategoryClick = (subCategory: string) => {
    onSubCategorySelect?.(subCategory);
  };

  return (
    <div className="w-80 h-full p-6 flex flex-col overflow-hidden">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 flex-shrink-0">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
          <span className="text-black font-bold text-lg">M</span>
        </div>
        <span className="text-white text-xl font-semibold">Mentor Meet</span>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6 flex-shrink-0">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Хайх..."
          className="w-full pl-10 pr-4 py-3 backdrop-blur-xl border border-gray-300/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gray-500"
        />
      </div>

      {/* Subcategory Filters - Wrap and Scroll */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-wrap gap-3">
          {currentSubCategories.map((subCategory, index) => (
            <button
              key={index}
              onClick={() => handleSubCategoryClick(subCategory)}
              className={`px-4 py-3 rounded-lg text-white text-sm transition-colors flex-shrink-0 ${
                selectedSubCategory === subCategory
                  ? "backdrop-blur-xl border border-blue-500/50 border-dashed"
                  : "backdrop-blur-xl border border-gray-600/50 hover:bg-gray-700/50"
              }`}
            >
              {subCategory}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
