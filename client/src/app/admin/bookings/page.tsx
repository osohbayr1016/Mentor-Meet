"use client";

import { useState } from "react";
import BookingsTable from "../../../components/admin/BookingsTable";

interface BookingsPageProps {
  searchParams: Promise<{
    status?: string;
    subject?: string;
    sessionType?: string;
    dateRange?: string;
    search?: string;
    page?: string;
    limit?: string;
  }>;
}

export default function BookingsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Захиалгын удирдлага
            </h1>
            <p className="text-gray-600 mt-2">
              Платформ дээрх бүх захиалгыг удирдах болон хянах
            </p>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <BookingsTable key={refreshKey} onRefresh={handleRefresh} />
    </div>
  );
}
