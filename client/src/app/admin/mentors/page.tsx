"use client";

import { useState } from "react";
import MentorsTable from "../../../components/admin/MentorsTable";

export default function MentorsPage() {
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
              Багш нарын удирдлага
            </h1>
            <p className="text-gray-600 mt-2">
              Платформ дээрх бүх багш нарыг удирдах, зөвшөөрөх болон хянах
            </p>
          </div>
        </div>
      </div>

      {/* Mentors Table */}
      <MentorsTable key={refreshKey} onRefresh={handleRefresh} />
    </div>
  );
}
