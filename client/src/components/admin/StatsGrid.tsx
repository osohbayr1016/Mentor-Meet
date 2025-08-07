"use client";

import { useState, useEffect } from "react";
import {
  Users,
  UserCheck,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Star,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";

interface AdminStats {
  totalUsers: number;
  totalMentors: number;
  activeBookings: number;
  monthlyRevenue: number;
  totalRevenue: number;
  averageRating: number;
  pendingMentorApprovals: number;
  conversionRate: number;
  userGrowth: number;
  mentorGrowth: number;
  bookingGrowth: number;
  revenueGrowth: number;
}

interface StatsGridProps {
  onRefresh?: () => void;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  change,
  changeType = "positive",
}: StatCardProps) {
  const changeColor = {
    positive: "text-green-600",
    negative: "text-red-600",
    neutral: "text-gray-600",
  }[changeType];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
          {change && (
            <div className="flex items-center text-sm">
              <ArrowUpRight className={`h-4 w-4 mr-1 ${changeColor}`} />
              <span className={changeColor}>{change}</span>
            </div>
          )}
        </div>
        <div
          className={`
          p-3 rounded-full flex-shrink-0
          ${color.replace("text", "bg").replace("-600", "-100")}
        `}
        >
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </div>
  );
}

export default function StatsGrid({ onRefresh }: StatsGridProps) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/dashboard");
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data.stats);
        setLastUpdated(result.data.lastUpdated);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    if (onRefresh) {
      onRefresh();
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Set up auto-refresh every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number) => {
    const formattedNumber = amount.toLocaleString("en-US");
    return `₮ ${formattedNumber}`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const formatLastUpdated = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Статистик мэдээлэл ачаалахад алдаа гарлаа.</p>
        <button 
          onClick={handleRefresh}
          className="mt-2 text-red-600 hover:text-red-800 underline"
        >
          Дахин оролдох
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Статистик мэдээлэл</h2>
          {lastUpdated && (
            <p className="text-sm text-gray-500">
              Сүүлд шинэчлэгдсэн: {formatLastUpdated(lastUpdated)}
            </p>
          )}
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? "Шинэчилж байна..." : "Шинэчлэх"}
        </button>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Нийт хэрэглэгч"
          value={stats.totalUsers.toLocaleString("en-US")}
          icon={Users}
          color="text-blue-600"
          change={`+${stats.userGrowth}% энэ сарын`}
          changeType="positive"
        />
        <StatCard
          title="Нийт багш"
          value={stats.totalMentors.toLocaleString("en-US")}
          icon={UserCheck}
          color="text-purple-600"
          change={`+${stats.mentorGrowth}% энэ сарын`}
          changeType="positive"
        />
        <StatCard
          title="Идэвхтэй захиалга"
          value={stats.activeBookings.toLocaleString("en-US")}
          icon={Calendar}
          color="text-green-600"
          change={`+${stats.bookingGrowth}% энэ сарын`}
          changeType="positive"
        />
        <StatCard
          title="Сарын орлого"
          value={formatCurrency(stats.monthlyRevenue)}
          icon={DollarSign}
          color="text-yellow-600"
          change={`+${stats.revenueGrowth}% энэ сарын`}
          changeType="positive"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Нийт орлого"
          value={formatCurrency(stats.totalRevenue)}
          icon={TrendingUp}
          color="text-indigo-600"
          change="Нийт дүн"
          changeType="neutral"
        />
        <StatCard
          title="Дундаж үнэлгээ"
          value={`⭐ ${stats.averageRating.toFixed(1)}`}
          icon={Star}
          color="text-orange-600"
          change="Сайн чанар"
          changeType="positive"
        />
        <StatCard
          title="Хүлээгдэж буй зөвшөөрөл"
          value={stats.pendingMentorApprovals.toLocaleString("en-US")}
          icon={AlertCircle}
          color="text-red-600"
          change="Шийдвэрлэх хэрэгтэй"
          changeType="neutral"
        />
        <StatCard
          title="Хөрвүүлэлтийн хувь"
          value={formatPercentage(stats.conversionRate)}
          icon={TrendingUp}
          color="text-teal-600"
          change="+5.2% энэ сарын"
          changeType="positive"
        />
      </div>
    </div>
  );
}
