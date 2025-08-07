"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Download,
  Filter,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Star,
  Target,
} from "lucide-react";

interface ReportData {
  userGrowth: {
    month: string;
    students: number;
    mentors: number;
  }[];
  revenueData: {
    month: string;
    revenue: number;
    bookings: number;
  }[];
  topMentors: {
    name: string;
    bookings: number;
    revenue: number;
    rating: number;
  }[];
  categoryStats: {
    category: string;
    bookings: number;
    revenue: number;
    percentage: number;
  }[];
  performanceMetrics: {
    totalSessions: number;
    completionRate: number;
    averageSessionDuration: number;
    customerSatisfaction: number;
    repeatBookingRate: number;
    averageResponseTime: number;
  };
}

export default function AdminReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [selectedReport, setSelectedReport] = useState("overview");

  // Mock data for demonstration
  useEffect(() => {
    const mockData: ReportData = {
      userGrowth: [
        { month: "Jan", students: 120, mentors: 25 },
        { month: "Feb", students: 145, mentors: 28 },
        { month: "Mar", students: 180, mentors: 32 },
        { month: "Apr", students: 220, mentors: 38 },
        { month: "May", students: 280, mentors: 45 },
        { month: "Jun", students: 340, mentors: 52 },
      ],
      revenueData: [
        { month: "Jan", revenue: 2400000, bookings: 48 },
        { month: "Feb", revenue: 3200000, bookings: 64 },
        { month: "Mar", revenue: 4100000, bookings: 82 },
        { month: "Apr", revenue: 5200000, bookings: 104 },
        { month: "May", revenue: 6800000, bookings: 136 },
        { month: "Jun", revenue: 8500000, bookings: 170 },
      ],
      topMentors: [
        { name: "Доктор Сарангэрэл", bookings: 45, revenue: 6750000, rating: 4.9 },
        { name: "Профессор Энхбаяр", bookings: 38, revenue: 7600000, rating: 4.8 },
        { name: "Магистр Оюунаа", bookings: 32, revenue: 3840000, rating: 4.7 },
        { name: "Доктор Батбаяр", bookings: 28, revenue: 4200000, rating: 4.6 },
        { name: "Профессор Цэцэг", bookings: 25, revenue: 3750000, rating: 4.8 },
      ],
      categoryStats: [
        { category: "Математик", bookings: 85, revenue: 12750000, percentage: 35 },
        { category: "Физик", bookings: 62, revenue: 9300000, percentage: 25 },
        { category: "Хими", bookings: 48, revenue: 7200000, percentage: 20 },
        { category: "Биологи", bookings: 35, revenue: 5250000, percentage: 15 },
        { category: "Бусад", bookings: 12, revenue: 1800000, percentage: 5 },
      ],
      performanceMetrics: {
        totalSessions: 1247,
        completionRate: 94.2,
        averageSessionDuration: 75,
        customerSatisfaction: 4.7,
        repeatBookingRate: 68.5,
        averageResponseTime: 12,
      },
    };

    setTimeout(() => {
      setReportData(mockData);
      setLoading(false);
    }, 1000);
  }, [selectedPeriod]);

  const formatCurrency = (amount: number) => {
    return `₮ ${amount.toLocaleString("en-US")}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!reportData) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Тайлан ба Дүн шинжилгээ</h1>
          <p className="text-gray-600">Системийн гүйцэтгэл болон статистик мэдээлэл</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Сүүлийн 7 хоног</option>
            <option value="30d">Сүүлийн 30 хоног</option>
            <option value="90d">Сүүлийн 90 хоног</option>
            <option value="1y">Сүүлийн жил</option>
          </select>
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Экспорт
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <RefreshCw className="h-4 w-4 mr-2" />
            Шинэчлэх
          </button>
        </div>
      </div>

      {/* Report Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex space-x-4">
          {[
            { key: "overview", label: "Ерөнхий тойм", icon: BarChart3 },
            { key: "revenue", label: "Орлогын тайлан", icon: DollarSign },
            { key: "users", label: "Хэрэглэгчдийн тайлан", icon: Users },
            { key: "performance", label: "Гүйцэтгэлийн тайлан", icon: Target },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setSelectedReport(tab.key)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  selectedReport === tab.key
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Нийт сессүүд</p>
              <p className="text-2xl font-bold text-gray-900">
                {reportData.performanceMetrics.totalSessions.toLocaleString("en-US")}
              </p>
              <div className="flex items-center text-sm mt-2">
                <ArrowUpRight className="h-4 w-4 mr-1 text-green-600" />
                <span className="text-green-600">+12% энэ сарын</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Дуусгах хувь</p>
              <p className="text-2xl font-bold text-gray-900">
                {reportData.performanceMetrics.completionRate}%
              </p>
              <div className="flex items-center text-sm mt-2">
                <ArrowUpRight className="h-4 w-4 mr-1 text-green-600" />
                <span className="text-green-600">+2.1% сайжирсан</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Дундаж үнэлгээ</p>
              <p className="text-2xl font-bold text-gray-900">
                {reportData.performanceMetrics.customerSatisfaction}
              </p>
              <div className="flex items-center text-sm mt-2">
                <Star className="h-4 w-4 mr-1 text-yellow-500" />
                <span className="text-gray-600">5-аас</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-yellow-100">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Хариу өгөх хугацаа</p>
              <p className="text-2xl font-bold text-gray-900">
                {reportData.performanceMetrics.averageResponseTime}м
              </p>
              <div className="flex items-center text-sm mt-2">
                <Clock className="h-4 w-4 mr-1 text-blue-600" />
                <span className="text-gray-600">Дундаж</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Орлогын өсөлт</h3>
          <div className="space-y-4">
            {reportData.revenueData.slice(-6).map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.month}</span>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(item.revenue / Math.max(...reportData.revenueData.map(d => d.revenue))) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-20 text-right">
                    {formatCurrency(item.revenue)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Mentors */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Шилдэг багш нар</h3>
          <div className="space-y-4">
            {reportData.topMentors.map((mentor, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-sm">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{mentor.name}</p>
                    <p className="text-sm text-gray-500">{mentor.bookings} захиалга</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatCurrency(mentor.revenue)}</p>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-yellow-400 mr-1" />
                    <span className="text-sm text-gray-500">{mentor.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Performance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ангиллын гүйцэтгэл</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {reportData.categoryStats.map((category, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">{category.category}</h4>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-blue-600">{category.percentage}%</div>
                <div className="text-sm text-gray-600">
                  {category.bookings} захиалга
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {formatCurrency(category.revenue)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Growth Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Хэрэглэгчдийн өсөлт</h3>
        <div className="space-y-4">
          {reportData.userGrowth.map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 items-center">
              <span className="text-sm text-gray-600">{item.month}</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${(item.students / Math.max(...reportData.userGrowth.map(d => d.students))) * 100}%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm text-blue-600">{item.students} суралцагч</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-green-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${(item.mentors / Math.max(...reportData.userGrowth.map(d => d.mentors))) * 100}%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm text-green-600">{item.mentors} багш</span>
              </div>
              <div className="text-sm text-gray-500">
                Нийт: {item.students + item.mentors}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}