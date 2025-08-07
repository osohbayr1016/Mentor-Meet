import { AdminStats } from "../../types/admin";
import StatsGrid from "../../components/admin/StatsGrid";
import RecentActivity from "../../components/admin/RecentActivity";
import QuickActions from "../../components/admin/QuickActions";

// Mock data for development
const mockStats: AdminStats = {
  totalUsers: 1247,
  totalMentors: 156,
  totalStudents: 1091,
  totalBookings: 356,
  totalRevenue: 125480000,
  monthlyRevenue: 45280000,
  pendingMentorApprovals: 12,
  activeBookings: 89,
  completedBookings: 234,
  averageRating: 4.8,
  recentSignups: 28,
  conversionRate: 23.5,
};

async function getAdminStats(): Promise<AdminStats> {
  try {
    // In production, fetch from your API
    // const response = await fetch(`${process.env.API_URL}/admin/stats`);
    // if (response.ok) {
    //   return await response.json();
    // }

    // Return mock data for development
    return mockStats;
  } catch (error) {
    console.error("Failed to fetch admin stats:", error);
    return mockStats;
  }
}

export default async function AdminDashboard() {
  const stats = await getAdminStats();

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
      <StatsGrid stats={stats} />

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>

        {/* Quick Actions - Takes 1 column */}
        <div>
          <QuickActions pendingApprovals={stats.pendingMentorApprovals} />
        </div>
      </div>
    </div>
  );
}
