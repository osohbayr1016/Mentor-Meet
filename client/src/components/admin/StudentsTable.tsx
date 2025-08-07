"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  MoreVertical,
  Mail,
  Phone,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Calendar,
  Star,
} from "lucide-react";
import Image from "next/image";

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  grade: string;
  school: string;
  status: "active" | "inactive" | "suspended" | "pending";
  joinDate: string;
  totalBookings: number;
  completedBookings: number;
  canceledBookings: number;
  totalSpent: number;
  averageRating: number;
  interests: string[];
  profileImage: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  address: string;
  district: string;
  emergencyContact: string;
  medicalInfo: string;
  preferredTime: string;
  learningStyle: string;
  goals: string;
  lastActive: string;
  isVerified: boolean;
  hasParentalConsent: boolean;
  subscriptionType: string;
  referralSource: string;
}

interface StudentsStats {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
  pending: number;
  verified: number;
  withParentalConsent: number;
  totalRevenue: number;
  totalBookings: number;
  averageBookingsPerStudent: number;
  averageSpentPerStudent: number;
}

interface StudentsTableProps {
  onRefresh?: () => void;
}

export default function StudentsTable({ onRefresh }: StudentsTableProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState<StudentsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [gradeFilter, setGradeFilter] = useState<string>("all");
  const [districtFilter, setDistrictFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [grades, setGrades] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("joinDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(gradeFilter !== "all" && { grade: gradeFilter }),
        ...(districtFilter !== "all" && { district: districtFilter }),
        ...(searchTerm && { search: searchTerm }),
        sortBy,
        sortOrder,
      });

      const response = await fetch(`/api/admin/students?${params}`);
      const result = await response.json();

      if (result.success) {
        setStudents(result.data.students);
        setStats(result.data.stats);
        setGrades(result.data.grades);
        setDistricts(result.data.districts);
        setTotalPages(result.data.pagination.totalPages);
        setLastUpdated(result.data.lastUpdated);
      }
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchStudents();
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleStudentAction = async (
    studentId: string,
    action: "activate" | "suspend" | "delete" | "sendMessage"
  ) => {
    setActionLoading(studentId);

    try {
      const response = await fetch("/api/admin/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, studentId }),
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message);
        fetchStudents(); // Refresh the data
      } else {
        alert("Алдаа гарлаа: " + result.error);
      }
    } catch (error) {
      console.error(`Failed to ${action} student:`, error);
      alert("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchStudents();
    }, 300); // Debounce API calls

    return () => clearTimeout(timeoutId);
  }, [
    currentPage,
    statusFilter,
    gradeFilter,
    districtFilter,
    searchTerm,
    sortBy,
    sortOrder,
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Идэвхтэй
          </span>
        );
      case "inactive":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Идэвхгүй
          </span>
        );
      case "suspended":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Түр хаагдсан
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Хүлээгдэж буй
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
          Суралцагч нарын мэдээлэл ачаалахад алдаа гарлаа.
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
              Суралцагч нарын удирдлага
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
            <div className="text-sm text-gray-500">Нийт суралцагч</div>
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
              {stats.totalBookings}
            </div>
            <div className="text-sm text-gray-500">Нийт захиалга</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-600">
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
                placeholder="Суралцагч хайх..."
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
              <option value="inactive">Идэвхгүй</option>
              <option value="suspended">Түр хаагдсан</option>
              <option value="pending">Хүлээгдэж буй</option>
            </select>

            {/* Grade Filter */}
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Бүх анги</option>
              {grades.map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>

            {/* District Filter */}
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Бүх дүүрэг</option>
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>

          {selectedStudents.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {selectedStudents.length} сонгогдсон
              </span>
              <button
                onClick={() =>
                  handleStudentAction(selectedStudents[0], "sendMessage")
                }
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
              >
                Мессеж илгээх
              </button>
              <button
                onClick={() =>
                  handleStudentAction(selectedStudents[0], "suspend")
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
              Суралцагч нарын жагсаалт ({students.length})
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
                        setSelectedStudents(students.map((s) => s.id));
                      } else {
                        setSelectedStudents([]);
                      }
                    }}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Суралцагч
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Сургууль/Анги
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Төлөв
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статистик
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Зарцуулсан
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Үйлдэл
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  {/* Checkbox */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedStudents.includes(student.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStudents([
                            ...selectedStudents,
                            student.id,
                          ]);
                        } else {
                          setSelectedStudents(
                            selectedStudents.filter((id) => id !== student.id)
                          );
                        }
                      }}
                    />
                  </td>

                  {/* Student Info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <Image
                          src={student.profileImage}
                          alt={student.name}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {student.name}
                          {student.isVerified && (
                            <CheckCircle className="inline h-4 w-4 text-blue-500 ml-1" />
                          )}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {student.email}
                        </div>
                        <div className="text-xs text-gray-400 flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {student.phone}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* School/Grade */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {student.school}
                    </div>
                    <div className="text-sm text-gray-500">
                      {student.grade} анги • {student.district}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(student.status)}
                  </td>

                  {/* Stats */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        <span>{student.totalBookings} захиалга</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span>{student.averageRating.toFixed(1)} үнэлгээ</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {student.completedBookings} дууссан
                      </div>
                    </div>
                  </td>

                  {/* Spending */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-green-500 mr-1" />
                      <span>{formatCurrency(student.totalSpent)}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {student.subscriptionType} багц
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {student.status === "pending" && (
                        <button
                          onClick={() =>
                            handleStudentAction(student.id, "activate")
                          }
                          disabled={actionLoading === student.id}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50"
                          title="Идэвхжүүлэх"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      {student.status === "active" && (
                        <button
                          onClick={() =>
                            handleStudentAction(student.id, "suspend")
                          }
                          disabled={actionLoading === student.id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          title="Түр хаах"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      )}
                      {student.status === "suspended" && (
                        <button
                          onClick={() =>
                            handleStudentAction(student.id, "activate")
                          }
                          disabled={actionLoading === student.id}
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
        {students.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <p className="text-lg font-medium">Суралцагч олдсонгүй</p>
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
