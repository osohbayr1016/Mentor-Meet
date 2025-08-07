"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, Download, Calendar } from "lucide-react";
import { BookingFilters } from "../../types/admin";

interface BookingsFiltersProps {
  initialFilters: BookingFilters;
}

export default function BookingsFilters({ initialFilters }: BookingsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState<BookingFilters>(initialFilters);
  const [searchTerm, setSearchTerm] = useState(initialFilters.search || "");

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    
    // Clear existing params
    params.delete('status');
    params.delete('paymentStatus');
    params.delete('dateFrom');
    params.delete('dateTo');
    params.delete('search');
    params.delete('page');
    
    // Add new params
    if (filters.status) params.set('status', filters.status);
    if (filters.paymentStatus) params.set('paymentStatus', filters.paymentStatus);
    if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.set('dateTo', filters.dateTo);
    if (filters.search) params.set('search', filters.search);
    if (filters.page && filters.page > 1) params.set('page', filters.page.toString());
    
    router.push(`/admin/bookings?${params.toString()}`);
  }, [filters, router, searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
  };

  const handleFilterChange = (key: keyof BookingFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm("");
  };

  const hasActiveFilters = filters.status || filters.paymentStatus || filters.dateFrom || filters.dateTo || filters.search;

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
              placeholder="Захиалга хайх... (суралцагч, багш, имэйл)"
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
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500">
            <Calendar className="h-4 w-4 mr-2" />
            Календар
          </button>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={filters.status || ""}
            onChange={(e) => handleFilterChange("status", e.target.value || undefined)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Бүх төлөв</option>
            <option value="pending">Хүлээгдэж буй</option>
            <option value="confirmed">Баталгаажсан</option>
            <option value="completed">Дууссан</option>
            <option value="cancelled">Цуцлагдсан</option>
            <option value="refunded">Буцаагдсан</option>
          </select>
        </div>

        {/* Payment Status Filter */}
        <select
          value={filters.paymentStatus || ""}
          onChange={(e) => handleFilterChange("paymentStatus", e.target.value || undefined)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Бүх төлбөр</option>
          <option value="pending">Төлбөр хүлээгдэж буй</option>
          <option value="paid">Төлөгдсөн</option>
          <option value="failed">Амжилтгүй</option>
          <option value="refunded">Буцаагдсан</option>
        </select>

        {/* Date Range */}
        <div className="flex items-center space-x-2">
          <input
            type="date"
            value={filters.dateFrom || ""}
            onChange={(e) => handleFilterChange("dateFrom", e.target.value || undefined)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="text-gray-500">-</span>
          <input
            type="date"
            value={filters.dateTo || ""}
            onChange={(e) => handleFilterChange("dateTo", e.target.value || undefined)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

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
            ({Object.values(filters).filter(v => v !== undefined && v !== "").length} шүүлт идэвхтэй)
          </span>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filters.status && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                Төлөв: {filters.status}
                <button
                  onClick={() => handleFilterChange("status", undefined)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.paymentStatus && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                Төлбөр: {filters.paymentStatus}
                <button
                  onClick={() => handleFilterChange("paymentStatus", undefined)}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
            {(filters.dateFrom || filters.dateTo) && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                Огноо: {filters.dateFrom || "..."} - {filters.dateTo || "..."}
                <button
                  onClick={() => {
                    handleFilterChange("dateFrom", undefined);
                    handleFilterChange("dateTo", undefined);
                  }}
                  className="ml-2 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.search && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                Хайлт: "{filters.search}"
                <button
                  onClick={() => {
                    handleFilterChange("search", undefined);
                    setSearchTerm("");
                  }}
                  className="ml-2 text-orange-600 hover:text-orange-800"
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