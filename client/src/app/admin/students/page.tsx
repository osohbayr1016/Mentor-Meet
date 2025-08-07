"use client";

import { useState } from "react";
import StudentsTable from "../../../components/admin/StudentsTable";

export default function StudentsPage() {
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
              Суралцагч нарын удирдлага
            </h1>
            <p className="text-gray-600 mt-2">
              Платформ дээрх бүх суралцагч нарыг удирдах болон хянах
            </p>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <StudentsTable key={refreshKey} onRefresh={handleRefresh} />
    </div>
  );
}
