"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, Download, Plus } from "lucide-react";
import { MentorFilters } from "../../types/admin";

interface MentorsFiltersProps {
  initialFilters: MentorFilters;
}

export default function MentorsFilters({
  initialFilters,
}: MentorsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<MentorFilters>(initialFilters);
  const [searchTerm, setSearchTerm] = useState(initialFilters.search || "");

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    // Clear existing params
    params.delete("approved");
    params.delete("category");
    params.delete("search");
    params.delete("page");

    // Add new params
    if (filters.approved !== undefined) {
      params.set("approved", filters.approved.toString());
    }
    if (filters.category) {
      params.set("category", filters.category);
    }
    if (filters.search) {
      params.set("search", filters.search);
    }
    if (filters.page && filters.page > 1) {
      params.set("page", filters.page.toString());
    }

    router.push(`/admin/mentors?${params.toString()}`);
  }, [filters, router, searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, search: searchTerm, page: 1 }));
  };

  const handleFilterChange = (key: keyof MentorFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm("");
  };

  const hasActiveFilters =
    filters.approved !== undefined || filters.category || filters.search;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Search and Actions Row */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Багш хайх... (нэр, имэйл, ангилал)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </form>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500">
            <Download className="h-4 w-4 mr-2" />
            Экспорт
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500">
            <Plus className="h-4 w-4 mr-2" />
            Багш нэмэх
          </button>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={
              filters.approved === undefined
                ? "all"
                : filters.approved.toString()
            }
            onChange={(e) => {
              const value =
                e.target.value === "all"
                  ? undefined
                  : e.target.value === "true";
              handleFilterChange("approved", value);
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Бүх төлөв</option>
            <option value="true">Зөвшөөрөгдсөн</option>
            <option value="false">Хүлээгдэж буй</option>
          </select>
        </div>

        {/* Category Filter */}
        <select
          value={filters.category || ""}
          onChange={(e) =>
            handleFilterChange("category", e.target.value || undefined)
          }
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Бүх ангилал</option>
          <option value="Програм хангамж">Програм хангамж</option>
          <option value="Дизайн">Дизайн</option>
          <option value="Маркетинг">Маркетинг</option>
          <option value="Бизнес">Бизнес</option>
          <option value="Санхүү">Санхүү</option>
          <option value="Хэл сурах">Хэл сурах</option>
        </select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Шүүлтийг цэвэрлэх
          </button>
        )}

        {/* Active Filters Count */}
        {hasActiveFilters && (
          <span className="text-sm text-gray-500">
            (
            {
              Object.values(filters).filter((v) => v !== undefined && v !== "")
                .length
            }{" "}
            шүүлт идэвхтэй)
          </span>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filters.approved !== undefined && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                {filters.approved ? "Зөвшөөрөгдсөн" : "Хүлээгдэж буй"}
                <button
                  onClick={() => handleFilterChange("approved", undefined)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                {filters.category}
                <button
                  onClick={() => handleFilterChange("category", undefined)}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.search && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                Хайлт: "{filters.search}"
                <button
                  onClick={() => {
                    handleFilterChange("search", undefined);
                    setSearchTerm("");
                  }}
                  className="ml-2 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
