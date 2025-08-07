import React, { useState, useEffect } from "react";
import MentorCard from "./MentorCard";
import axios from "axios";

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
interface Category {
  _id: string;
  categoryName: string;
  subCategory: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface MentorCardsProps {
  selectedCategory?: string;
  selectedSubCategory?: string;
  categories: Category[];
  onMentorClick?: (mentor: Mentor) => void;
}

const MentorCards: React.FC<MentorCardsProps> = ({
  selectedCategory,
  selectedSubCategory,
  onMentorClick,
  categories,
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
    if (!mounted || !categories || categories.length === 0) return;

    const fetchMentors = async () => {
      try {
        setLoading(true);
        setError(null);

        // Query params бэлдэх
        const params: Record<string, string> = {};

        // Always filter by category if selected
        if (
          selectedCategory &&
          selectedCategory !== "" &&
          selectedCategory !== "all"
        ) {
          const selectedCategoryName = categories.find(
            (cat) => cat._id === selectedCategory
          )?.categoryName;
          if (selectedCategoryName) {
            params.category = selectedCategoryName;
          }
        }

        // Add subcategory filter if selected
        if (selectedSubCategory) {
          params.subCategory = selectedSubCategory;
        }

        const API_BASE_URL = "http://localhost:8000";

        // Try with fetch instead of axios
        const queryString = new URLSearchParams(params).toString();
        const url = `${API_BASE_URL}/mentors${
          queryString ? `?${queryString}` : ""
        }`;

        console.log("🔗 Fetching from:", url);

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Data received:", data);
        setMentors(data as Mentor[]);
      } catch (error) {
        console.error("Error fetching mentors:", error);
        setError("Менторуудыг авахад алдаа гарлаа.");
        // Set empty array instead of showing error immediately
        setMentors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, [mounted, selectedCategory, selectedSubCategory, categories]);

  // Filter mentors based on category and subcategory
  const filteredMentors = mentors.filter((mentor: Mentor) => {
    // If no filters are selected, show all mentors
    if (
      (!selectedCategory ||
        selectedCategory === "" ||
        selectedCategory === "all") &&
      !selectedSubCategory
    ) {
      return true;
    }

    // Check category filter
    let matchesCategory = true;
    if (
      selectedCategory &&
      selectedCategory !== "" &&
      selectedCategory !== "all"
    ) {
      const selectedCategoryName = categories.find(
        (cat) => cat._id === selectedCategory
      )?.categoryName;
      matchesCategory = selectedCategoryName
        ? mentor.category === selectedCategoryName
        : true;
    }

    // Check subcategory filter
    let matchesSubCategory = true;
    if (selectedSubCategory) {
      matchesSubCategory = mentor.subCategory === selectedSubCategory;
    }

    // Both filters must match
    return matchesCategory && matchesSubCategory;
  });

  return (
    <div className="flex-1 h-full flex flex-col ">
      {/* Fixed Title */}
      <div className="p-6 pb-4 flex-shrink-0">
        <h1 className="text-white text-[24px] font-semibold">
          Менторуудтайгаа танилцана уу!
        </h1>
        {selectedSubCategory && (
          <p className="text-gray-300 text-sm mt-2">{selectedSubCategory}</p>
        )}
        {!selectedSubCategory &&
          selectedCategory &&
          selectedCategory !== "" &&
          selectedCategory !== "all" && (
            <p className="text-gray-300 text-sm mt-2">
              {categories.find((cat) => cat._id === selectedCategory)
                ?.categoryName || selectedCategory}
            </p>
          )}
        {!selectedSubCategory &&
          (!selectedCategory ||
            selectedCategory === "" ||
            selectedCategory === "all") && (
            <p className="text-gray-300 text-sm mt-2">Бүх Ментор</p>
          )}
      </div>

      {/* Scrollable Mentor Cards Area */}
      <div className="flex-1 px-6 pb-6 overflow-y-auto ">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-3 h-8 border border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
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
