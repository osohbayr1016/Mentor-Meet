"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  MoreVertical,
  Star,
  DollarSign,
  Calendar,
  Search,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";

interface Mentor {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  status: "active" | "pending" | "suspended" | "inactive";
  joinDate: string;
  totalBookings: number;
  completedBookings: number;
  totalRevenue: number;
  hourlyRate: number;
  rating: number;
  completionRate: number;
  responseTime: number;
  isVerified: boolean;
  profileImage: string;
  bio: string;
  education: string;
  experience: number;
  languages: string[];
  lastActive: string;
}

interface MentorsStats {
  total: number;
  active: number;
  pending: number;
  suspended: number;
  inactive: number;
  verified: number;
  averageRating: number;
  totalRevenue: number;
  totalBookings: number;
  averageResponseTime: number;
}

interface MentorsTableProps {
  onRefresh?: () => void;
}

const MentorsTable = ({ onRefresh }: MentorsTableProps) => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [stats, setStats] = useState<MentorsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMentors, setSelectedMentors] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [specializationFilter, setSpecializationFilter] =
    useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("joinDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchMentors = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(specializationFilter !== "all" && {
          specialization: specializationFilter,
        }),
        ...(searchTerm && { search: searchTerm }),
        sortBy,
        sortOrder,
      });

      const response = await fetch(`/api/admin/mentors?${params}`);
      const result = await response.json();

      if (result.success) {
        setMentors(result.data.mentors);
        setStats(result.data.stats);
        setSpecializations(result.data.specializations);
        setTotalPages(result.data.pagination.totalPages);
        setLastUpdated(result.data.lastUpdated);
      }
    } catch (error) {
      console.error("Failed to fetch mentors:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, specializationFilter, searchTerm, sortBy, sortOrder]);

  const handleRefresh = () => {
    fetchMentors();
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleMentorAction = async (
    mentorId: string,
    action: "approve" | "suspend" | "activate" | "delete"
  ) => {
    setActionLoading(mentorId);

    try {
      const response = await fetch("/api/admin/mentors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, mentorId }),
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message);
        fetchMentors(); // Refresh the data
      } else {
        alert("Алдаа гарлаа: " + result.error);
      }
    } catch (error) {
      console.error(`Failed to ${action} mentor:`, error);
      alert("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchMentors();
    }, 300); // Debounce API calls

    return () => clearTimeout(timeoutId);
  }, [fetchMentors]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Идэвхтэй
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Хүлээгдэж буй
          </span>
        );
      case "suspended":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Түр хаагдсан
          </span>
        );
      case "inactive":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Идэвхгүй
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Тодорхойгүй
          </span>
        );
    }
  };

  const formatCurrency = (amount: number) => {
    const formattedNumber = amount.toLocaleString("en-US");
    return `₮ ${formattedNumber}`;
  };

  const formatLastUpdated = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  if (loading && !stats) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex space-x-4">
                <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">
          Багш нарын мэдээлэл ачаалахад алдаа гарлаа.
        </p>
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
      {/* Header with Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Багш нарын удирдлага
            </h2>
            {lastUpdated && (
              <p className="text-sm text-gray-500">
                Сүүлд шинэчлэгдсэн: {formatLastUpdated(lastUpdated)}
              </p>
            )}
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            {loading ? "Шинэчилж байна..." : "Шинэчлэх"}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.total}
            </div>
            <div className="text-sm text-gray-500">Нийт багш</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.active}
            </div>
            <div className="text-sm text-gray-500">Идэвхтэй</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
            <div className="text-sm text-gray-500">Хүлээгдэж буй</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {stats.verified}
            </div>
            <div className="text-sm text-gray-500">Баталгаажсан</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {stats.averageRating.toFixed(1)}
            </div>
            <div className="text-sm text-gray-500">Дундаж үнэлгээ</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Багш хайх..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Бүх төлөв</option>
              <option value="active">Идэвхтэй</option>
              <option value="pending">Хүлээгдэж буй</option>
              <option value="suspended">Түр хаагдсан</option>
              <option value="inactive">Идэвхгүй</option>
            </select>

            {/* Specialization Filter */}
            <select
              value={specializationFilter}
              onChange={(e) => setSpecializationFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Бүх мэргэжил</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          {selectedMentors.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {selectedMentors.length} сонгогдсон
              </span>
              <button
                onClick={() =>
                  handleMentorAction(selectedMentors[0], "approve")
                }
                className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
              >
                Зөвшөөрөх
              </button>
              <button
                onClick={() =>
                  handleMentorAction(selectedMentors[0], "suspend")
                }
                className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
              >
                Түр хаах
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Багш нарын жагсаалт ({mentors.length})
            </h3>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedMentors(mentors.map((m) => m.id));
                      } else {
                        setSelectedMentors([]);
                      }
                    }}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Багш
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ангилал
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Төлөв
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статистик
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Орлого
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Үйлдэл
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mentors.map((mentor) => (
                <tr key={mentor.id} className="hover:bg-gray-50">
                  {/* Checkbox */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedMentors.includes(mentor.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMentors([...selectedMentors, mentor.id]);
                        } else {
                          setSelectedMentors(
                            selectedMentors.filter((id) => id !== mentor.id)
                          );
                        }
                      }}
                    />
                  </td>

                  {/* Mentor Info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <Image
                          src={mentor.profileImage}
                          alt={mentor.name}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {mentor.name}
                          {mentor.isVerified && (
                            <CheckCircle className="inline h-4 w-4 text-blue-500 ml-1" />
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {mentor.email}
                        </div>
                        <div className="text-xs text-gray-400">
                          {mentor.experience} жилийн туршлага •{" "}
                          {mentor.education}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Specialization */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {mentor.specialization}
                    </div>
                    <div className="text-xs text-gray-500">
                      {mentor.languages.join(", ")}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(mentor.status)}
                  </td>

                  {/* Stats */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        <span>{mentor.totalBookings} захиалга</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span>{mentor.rating.toFixed(1)} үнэлгээ</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {mentor.completionRate.toFixed(1)}% дуусгалт
                      </div>
                    </div>
                  </td>

                  {/* Revenue */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-green-500 mr-1" />
                      <span>{formatCurrency(mentor.totalRevenue)}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatCurrency(mentor.hourlyRate)}/цаг
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {mentor.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleMentorAction(mentor.id, "approve")
                            }
                            disabled={actionLoading === mentor.id}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                            title="Зөвшөөрөх"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      {mentor.status === "active" && (
                        <button
                          onClick={() =>
                            handleMentorAction(mentor.id, "suspend")
                          }
                          disabled={actionLoading === mentor.id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          title="Түр хаах"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      )}
                      {mentor.status === "suspended" && (
                        <button
                          onClick={() =>
                            handleMentorAction(mentor.id, "activate")
                          }
                          disabled={actionLoading === mentor.id}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50"
                          title="Идэвхжүүлэх"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        title="Дэлгэрэнгүй"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-900"
                        title="Засах"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-900"
                        title="Цэс"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {mentors.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <p className="text-lg font-medium">Багш олдсонгүй</p>
              <p className="text-sm mt-1">
                Шүүлтийн нөхцөлийг өөрчилж үзнэ үү.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Хуудас {currentPage} / {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Өмнөх
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Дараах
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(MentorsTable);
