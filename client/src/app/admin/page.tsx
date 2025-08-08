"use client";

import { useEffect, useState } from "react";
import StatsGrid from "../../components/admin/StatsGrid";
import RecentActivity from "../../components/admin/RecentActivity";
import QuickActions from "../../components/admin/QuickActions";
import { adminAPI } from "../../lib/admin-api";

export default function AdminDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [pendingApprovals, setPendingApprovals] = useState<number>(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await adminAPI.getDashboard();
        if (res?.success) {
          setPendingApprovals(res.data?.stats?.pendingMentorApprovals ?? 0);
        }
      } catch {}
    })();
  }, [refreshKey]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Үндсэн самбар</h1>
            <p className="text-gray-600 mt-2">
              Mentor Meet платформын ерөнхий мэдээлэл болон статистик
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Сүүлийн шинэчлэл</p>
            <p className="text-sm font-medium text-gray-900">
              {new Date().toLocaleDateString("mn-MN")}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <StatsGrid onRefresh={handleRefresh} />

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RecentActivity key={refreshKey} />
        </div>

        {/* Quick Actions - Takes 1 column */}
        <div>
          <QuickActions key={refreshKey} pendingApprovals={pendingApprovals} />
        </div>
      </div>
    </div>
  );
}
