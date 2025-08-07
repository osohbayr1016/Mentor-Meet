import { User, UserFilters } from "../../../types/admin";
import StudentsTable from "../../../components/admin/StudentsTable";
import StudentsFilters from "../../../components/admin/StudentsFilters";

// Mock data for development
const mockStudents: User[] = [
  {
    _id: "1",
    name: "Болормаа Цэрэн",
    email: "bolormaa@example.com",
    role: "student",
    createdAt: "2024-01-20T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
    isActive: true,
    avatar: undefined,
  },
  {
    _id: "2",
    name: "Мөнхбат Түмэн",
    email: "munkhbat@example.com",
    role: "student",
    createdAt: "2024-02-15T00:00:00Z",
    updatedAt: "2024-02-15T00:00:00Z",
    isActive: true,
    avatar: undefined,
  },
  {
    _id: "3",
    name: "Ганбаатар Сэргэлэн",
    email: "ganbaatar@example.com",
    role: "student",
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2024-03-01T00:00:00Z",
    isActive: false,
    avatar: undefined,
  },
  {
    _id: "4",
    name: "Цэцэгмаа Батбаяр",
    email: "tsetsegmaa@example.com",
    role: "student",
    createdAt: "2024-03-10T00:00:00Z",
    updatedAt: "2024-03-10T00:00:00Z",
    isActive: true,
    avatar: undefined,
  },
];

interface StudentsPageProps {
  searchParams: Promise<{
    isActive?: string;
    search?: string;
    page?: string;
    limit?: string;
  }>;
}

async function getStudents(
  filters: UserFilters
): Promise<{ students: User[]; total: number }> {
  try {
    // In production, fetch from your API
    // const queryParams = new URLSearchParams();
    // if (filters.isActive !== undefined) queryParams.set('isActive', filters.isActive.toString());
    // if (filters.search) queryParams.set('search', filters.search);
    // if (filters.page) queryParams.set('page', filters.page.toString());
    // if (filters.limit) queryParams.set('limit', filters.limit.toString());

    // const response = await fetch(`${process.env.API_URL}/admin/students?${queryParams}`);
    // if (response.ok) {
    //   return await response.json();
    // }

    // Filter mock data based on filters
    let filteredStudents = mockStudents;

    if (filters.isActive !== undefined) {
      filteredStudents = filteredStudents.filter(
        (student) => student.isActive === filters.isActive
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredStudents = filteredStudents.filter(
        (student) =>
          student.name.toLowerCase().includes(searchLower) ||
          student.email.toLowerCase().includes(searchLower)
      );
    }

    return {
      students: filteredStudents,
      total: filteredStudents.length,
    };
  } catch (error) {
    console.error("Failed to fetch students:", error);
    return {
      students: mockStudents,
      total: mockStudents.length,
    };
  }
}

export default async function StudentsPage({
  searchParams,
}: StudentsPageProps) {
  const resolvedSearchParams = await searchParams;

  const filters: UserFilters = {
    role: "student",
    isActive:
      resolvedSearchParams.isActive === "true"
        ? true
        : resolvedSearchParams.isActive === "false"
        ? false
        : undefined,
    search: resolvedSearchParams.search,
    page: parseInt(resolvedSearchParams.page || "1"),
    limit: parseInt(resolvedSearchParams.limit || "10"),
  };

  const { students, total } = await getStudents(filters);

  const stats = {
    total: mockStudents.length,
    active: mockStudents.filter((s) => s.isActive).length,
    inactive: mockStudents.filter((s) => !s.isActive).length,
    thisMonth: mockStudents.filter((s) => {
      const created = new Date(s.createdAt);
      const thisMonth = new Date();
      return (
        created.getMonth() === thisMonth.getMonth() &&
        created.getFullYear() === thisMonth.getFullYear()
      );
    }).length,
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
          <div className="text-right">
            <p className="text-sm text-gray-500">Нийт суралцагч</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Нийт суралцагч</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-green-600">
            {stats.active}
          </div>
          <div className="text-sm text-gray-600">Идэвхтэй</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-red-600">
            {stats.inactive}
          </div>
          <div className="text-sm text-gray-600">Идэвхгүй</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-purple-600">
            {stats.thisMonth}
          </div>
          <div className="text-sm text-gray-600">Энэ сарын шинэ</div>
        </div>
      </div>

      {/* Filters */}
      <StudentsFilters initialFilters={filters} />

      {/* Students Table */}
      <StudentsTable students={students} />
    </div>
  );
}
