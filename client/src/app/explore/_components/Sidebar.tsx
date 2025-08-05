import React from "react";
import { Search } from "lucide-react";

interface Category {
  _id: string;
  categoryName: string;
  subCategory: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface SidebarProps {
  selectedCategory?: string;
  onSubCategorySelect?: (subCategory: string) => void;
  selectedSubCategory?: string;
  categories?: Category[];
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedCategory = "",
  onSubCategorySelect,
  selectedSubCategory,
  categories = [],
}) => {
  // Get current subcategories from the selected category
  const currentSubCategories = categories.find(
    (cat) => cat._id === selectedCategory
  )?.subCategory || [];

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
