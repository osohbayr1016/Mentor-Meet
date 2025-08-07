import React from "react";
import { Search } from "lucide-react";
import Image from "next/image";

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
  // Get subcategories from the selected category only
  const selectedCategoryData = categories.find(
    (cat) => cat._id === selectedCategory
  );
  const currentSubCategories = selectedCategoryData?.subCategory || [];

  const handleSubCategoryClick = (subCategory: string) => {
    onSubCategorySelect?.(subCategory);
  };

  return (
    <div className="w-full h-full p-6 flex flex-col overflow-hidden">
      {/* Logo */}
      <div className="flex justify-center items-center gap-3 mb-8 pt-[20px]">
        <div className="flex gap-3 items-center justify-center">
          <Image
            src="https://res.cloudinary.com/dg2soqaow/image/upload/v1753978167/image_723_nuhvy3.png"
            alt="logo"
            width={24}
            height={24}
            className="rounded-full"
          />
          <p className="text-white text-[22px] font-bold">Mentor Meet</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6 flex-shrink-0">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Хайх..."
          className="w-full pl-10 pr-4 h-9 border border-gray-300/40 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-gray-500"
        />
      </div>

      {/* Subcategory Filters - Wrap and Scroll */}
      <div className="flex-1 overflow-y-auto">
        {/* Clear Filter Button */}
        {selectedSubCategory && (
          <div className="mb-4">
            <button
              onClick={() => handleSubCategoryClick("")}
              className="px-4 py-2 rounded-lg text-white text-sm transition-colors backdrop-blur-xl border border-red-500/50 hover:bg-red-500/20"
            >
              ✕ Бүх шүүлтүүрийг цэвэрлэх
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          {currentSubCategories.map((subCategory: string, index: number) => (
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
