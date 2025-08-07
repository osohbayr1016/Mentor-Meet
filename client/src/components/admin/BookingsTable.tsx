"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  MoreVertical,
  Calendar,
  Clock,
  DollarSign,
  Search,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

interface Booking {
  id: string;
  studentId: string;
  studentName: string;
  mentorId: string;
  mentorName: string;
  subject: string;
  sessionType: string;
  status: "confirmed" | "pending" | "completed" | "cancelled" | "no-show";
  bookingDate: string;
  sessionDate: string;
  sessionEndDate: string;
  duration: number;
  hourlyRate: number;
  totalAmount: number;
  paymentStatus: "paid" | "pending" | "refunded";
  paymentMethod: string;
  paymentId: string;
  meetingLink?: string;
  location?: string;
  notes: string;
  rating?: number;
  feedback: string;
  cancellationReason?: string;
  noShowReason?: string;
  rescheduleCount: number;
  isRecurring: boolean;
  recurringPattern?: string;
  preparationMaterials: string;
  sessionGoals: string;
  actualDuration?: number;
  attendanceStatus: string;
  sessionRecording?: string;
  homeworkAssigned?: string;
  nextSessionDate?: string;
}

interface BookingsStats {
  total: number;
  confirmed: number;
  pending: number;
  completed: number;
  cancelled: number;
  noShow: number;
  totalRevenue: number;
  averageBookingValue: number;
  completionRate: number;
  cancellationRate: number;
  noShowRate: number;
  averageRating: number;
}

interface BookingsTableProps {
  onRefresh?: () => void;
}

export default function BookingsTable({ onRefresh }: BookingsTableProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<BookingsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [sessionTypeFilter, setSessionTypeFilter] = useState<string>("all");
  const [dateRangeFilter, setDateRangeFilter] = useState<string>("30d");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [sessionTypes, setSessionTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("bookingDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(subjectFilter !== "all" && { subject: subjectFilter }),
        ...(sessionTypeFilter !== "all" && { sessionType: sessionTypeFilter }),
        ...(dateRangeFilter !== "all" && { dateRange: dateRangeFilter }),
        ...(searchTerm && { search: searchTerm }),
        sortBy,
        sortOrder,
      });

      const response = await fetch(`/api/admin/bookings?${params}`);
      const result = await response.json();

      if (result.success) {
        setBookings(result.data.bookings);
        setStats(result.data.stats);
        setSubjects(result.data.subjects);
        setSessionTypes(result.data.sessionTypes);
        setTotalPages(result.data.pagination.totalPages);
        setLastUpdated(result.data.lastUpdated);
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchBookings();
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleBookingAction = async (
    bookingId: string,
    action:
      | "confirm"
      | "cancel"
      | "reschedule"
      | "markCompleted"
      | "markNoShow"
      | "processRefund"
  ) => {
    setActionLoading(bookingId);

    try {
      const response = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, bookingId }),
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message);
        fetchBookings(); // Refresh the data
      } else {
        alert("Алдаа гарлаа: " + result.error);
      }
    } catch (error) {
      console.error(`Failed to ${action} booking:`, error);
      alert("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchBookings();
    }, 300); // Debounce API calls

    return () => clearTimeout(timeoutId);
  }, [
    currentPage,
    statusFilter,
    subjectFilter,
    sessionTypeFilter,
    dateRangeFilter,
    searchTerm,
    sortBy,
    sortOrder,
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Баталгаажсан
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Хүлээгдэж буй
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Дууссан
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Цуцлагдсан
          </span>
        );
      case "no-show":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Ирээгүй
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

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Төлөгдсөн
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Хүлээгдэж буй
          </span>
        );
      case "refunded":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Буцаагдсан
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("mn-MN");
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
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
          Захиалгын мэдээлэл ачаалахад алдаа гарлаа.
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
              Захиалгын удирдлага
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
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.total}
            </div>
            <div className="text-sm text-gray-500">Нийт захиалга</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.confirmed}
            </div>
            <div className="text-sm text-gray-500">Баталгаажсан</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {stats.completed}
            </div>
            <div className="text-sm text-gray-500">Дууссан</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
            <div className="text-sm text-gray-500">Хүлээгдэж буй</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {stats.cancelled}
            </div>
            <div className="text-sm text-gray-500">Цуцлагдсан</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {formatCurrency(stats.totalRevenue)}
            </div>
            <div className="text-sm text-gray-500">Нийт орлого</div>
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
                placeholder="Захиалга хайх..."
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
              <option value="confirmed">Баталгаажсан</option>
              <option value="pending">Хүлээгдэж буй</option>
              <option value="completed">Дууссан</option>
              <option value="cancelled">Цуцлагдсан</option>
              <option value="no-show">Ирээгүй</option>
            </select>

            {/* Subject Filter */}
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Бүх хичээл</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>

            {/* Session Type Filter */}
            <select
              value={sessionTypeFilter}
              onChange={(e) => setSessionTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Бүх төрөл</option>
              {sessionTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            {/* Date Range Filter */}
            <select
              value={dateRangeFilter}
              onChange={(e) => setDateRangeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7d">Сүүлийн 7 хоног</option>
              <option value="30d">Сүүлийн 30 хоног</option>
              <option value="90d">Сүүлийн 90 хоног</option>
              <option value="1y">Сүүлийн жил</option>
            </select>
          </div>

          {selectedBookings.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {selectedBookings.length} сонгогдсон
              </span>
              <button
                onClick={() =>
                  handleBookingAction(selectedBookings[0], "confirm")
                }
                className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
              >
                Баталгаажуулах
              </button>
              <button
                onClick={() =>
                  handleBookingAction(selectedBookings[0], "cancel")
                }
                className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
              >
                Цуцлах
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
              Захиалгын жагсаалт ({bookings.length})
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
                        setSelectedBookings(bookings.map((b) => b.id));
                      } else {
                        setSelectedBookings([]);
                      }
                    }}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Захиалга
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Суралцагч / Багш
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Хичээл
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Огноо/Цаг
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Төлөв
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Төлбөр
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Үйлдэл
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  {/* Checkbox */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedBookings.includes(booking.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedBookings([
                            ...selectedBookings,
                            booking.id,
                          ]);
                        } else {
                          setSelectedBookings(
                            selectedBookings.filter((id) => id !== booking.id)
                          );
                        }
                      }}
                    />
                  </td>

                  {/* Booking Info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {booking.id}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.duration} минут • {booking.sessionType}
                    </div>
                  </td>

                  {/* Student & Mentor */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {booking.studentName}
                    </div>
                    <div className="text-sm text-gray-500">
                      Багш: {booking.mentorName}
                    </div>
                  </td>

                  {/* Subject */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {booking.subject}
                    </div>
                  </td>

                  {/* Date/Time */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      {formatDate(booking.sessionDate)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1 text-gray-400" />
                      {formatTime(booking.sessionDate)} -{" "}
                      {formatTime(booking.sessionEndDate)}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(booking.status)}
                  </td>

                  {/* Payment */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(booking.totalAmount)}
                    </div>
                    <div className="mt-1">
                      {getPaymentStatusBadge(booking.paymentStatus)}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {booking.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleBookingAction(booking.id, "confirm")
                            }
                            disabled={actionLoading === booking.id}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                            title="Баталгаажуулах"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleBookingAction(booking.id, "cancel")
                            }
                            disabled={actionLoading === booking.id}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            title="Цуцлах"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      {booking.status === "confirmed" && (
                        <button
                          onClick={() =>
                            handleBookingAction(booking.id, "markCompleted")
                          }
                          disabled={actionLoading === booking.id}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50"
                          title="Дууссан гэж тэмдэглэх"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      {booking.meetingLink && (
                        <a
                          href={booking.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-900"
                          title="Уулзалт нээх"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
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
        {bookings.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <p className="text-lg font-medium">Захиалга олдсонгүй</p>
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
}
