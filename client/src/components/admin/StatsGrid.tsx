"use client";

import {
  Users,
  UserCheck,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Star,
  ArrowUpRight,
} from "lucide-react";
import { AdminStats } from "../../types/admin";

interface StatsGridProps {
  stats: AdminStats;
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

export default function StatsGrid({ stats }: StatsGridProps) {
  const formatCurrency = (amount: number) => {
    // Use a consistent format that works the same on server and client
    const formattedNumber = amount.toLocaleString("en-US");
    return `₮ ${formattedNumber}`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Нийт хэрэглэгч"
          value={stats.totalUsers.toLocaleString("en-US")}
          icon={Users}
          color="text-blue-600"
          change="+12% энэ сарын"
          changeType="positive"
        />
        <StatCard
          title="Нийт багш"
          value={stats.totalMentors.toLocaleString("en-US")}
          icon={UserCheck}
          color="text-purple-600"
          change="+8% энэ сарын"
          changeType="positive"
        />
        <StatCard
          title="Идэвхтэй захиалга"
          value={stats.activeBookings}
          icon={Calendar}
          color="text-green-600"
          change="+15% энэ сарын"
          changeType="positive"
        />
        <StatCard
          title="Сарын орлого"
          value={formatCurrency(stats.monthlyRevenue)}
          icon={DollarSign}
          color="text-yellow-600"
          change="+23% энэ сарын"
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
          value={`⭐ ${stats.averageRating}`}
          icon={Star}
          color="text-orange-600"
          change="Сайн чанар"
          changeType="positive"
        />
        <StatCard
          title="Хүлээгдэж буй зөвшөөрөл"
          value={stats.pendingMentorApprovals}
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
