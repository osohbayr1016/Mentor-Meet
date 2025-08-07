import { Booking, BookingFilters } from "../../../types/admin";
import BookingsTable from "../../../components/admin/BookingsTable";
import BookingsFilters from "../../../components/admin/BookingsFilters";

// Mock data for development
const mockBookings: Booking[] = [
  {
    _id: "1",
    studentId: "student1",
    mentorId: "mentor1",
    student: {
      _id: "student1",
      name: "Болормаа Цэрэн",
      email: "bolormaa@example.com",
      role: "student",
      createdAt: "2024-01-20T00:00:00Z",
      updatedAt: "2024-01-20T00:00:00Z",
      isActive: true,
    },
    mentor: {
      _id: "mentor1",
      name: "Батбаяр Мөнх",
      email: "batbayar@example.com",
      role: "mentor",
      createdAt: "2024-01-15T00:00:00Z",
      updatedAt: "2024-01-15T00:00:00Z",
      isActive: true,
    },
    date: "2024-03-25",
    startTime: "14:00",
    endTime: "15:00",
    duration: 60,
    amount: 50000,
    status: "confirmed",
    paymentStatus: "paid",
    meetingLink: "https://meet.google.com/abc-def-ghi",
    createdAt: "2024-03-20T00:00:00Z",
    updatedAt: "2024-03-20T00:00:00Z",
  },
  {
    _id: "2",
    studentId: "student2",
    mentorId: "mentor2",
    student: {
      _id: "student2",
      name: "Мөнхбат Түмэн",
      email: "munkhbat@example.com",
      role: "student",
      createdAt: "2024-02-15T00:00:00Z",
      updatedAt: "2024-02-15T00:00:00Z",
      isActive: true,
    },
    mentor: {
      _id: "mentor2",
      name: "Энхбат Ганбат",
      email: "enhbat@example.com",
      role: "mentor",
      createdAt: "2023-12-10T00:00:00Z",
      updatedAt: "2023-12-10T00:00:00Z",
      isActive: true,
    },
    date: "2024-03-26",
    startTime: "10:00",
    endTime: "11:00",
    duration: 60,
    amount: 60000,
    status: "pending",
    paymentStatus: "pending",
    createdAt: "2024-03-21T00:00:00Z",
    updatedAt: "2024-03-21T00:00:00Z",
  },
  {
    _id: "3",
    studentId: "student3",
    mentorId: "mentor1",
    student: {
      _id: "student3",
      name: "Цэцэгмаа Батбаяр",
      email: "tsetsegmaa@example.com",
      role: "student",
      createdAt: "2024-03-10T00:00:00Z",
      updatedAt: "2024-03-10T00:00:00Z",
      isActive: true,
    },
    mentor: {
      _id: "mentor1",
      name: "Батбаяр Мөнх",
      email: "batbayar@example.com",
      role: "mentor",
      createdAt: "2024-01-15T00:00:00Z",
      updatedAt: "2024-01-15T00:00:00Z",
      isActive: true,
    },
    date: "2024-03-22",
    startTime: "16:00",
    endTime: "17:00",
    duration: 60,
    amount: 50000,
    status: "completed",
    paymentStatus: "paid",
    meetingLink: "https://meet.google.com/xyz-abc-def",
    createdAt: "2024-03-18T00:00:00Z",
    updatedAt: "2024-03-22T17:00:00Z",
  },
];

interface BookingsPageProps {
  searchParams: Promise<{
    status?: string;
    paymentStatus?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
    page?: string;
    limit?: string;
  }>;
}

async function getBookings(
  filters: BookingFilters
): Promise<{ bookings: Booking[]; total: number }> {
  try {
    // In production, fetch from your API
    // const queryParams = new URLSearchParams();
    // Object.entries(filters).forEach(([key, value]) => {
    //   if (value !== undefined && value !== null) {
    //     queryParams.set(key, value.toString());
    //   }
    // });

    // const response = await fetch(`${process.env.API_URL}/admin/bookings?${queryParams}`);
    // if (response.ok) {
    //   return await response.json();
    // }

    // Filter mock data based on filters
    let filteredBookings = mockBookings;

    if (filters.status) {
      filteredBookings = filteredBookings.filter(
        (booking) => booking.status === filters.status
      );
    }

    if (filters.paymentStatus) {
      filteredBookings = filteredBookings.filter(
        (booking) => booking.paymentStatus === filters.paymentStatus
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredBookings = filteredBookings.filter(
        (booking) =>
          booking.student?.name.toLowerCase().includes(searchLower) ||
          booking.mentor?.name.toLowerCase().includes(searchLower) ||
          booking.student?.email.toLowerCase().includes(searchLower) ||
          booking.mentor?.email.toLowerCase().includes(searchLower)
      );
    }

    return {
      bookings: filteredBookings,
      total: filteredBookings.length,
    };
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    return {
      bookings: mockBookings,
      total: mockBookings.length,
    };
  }
}

export default async function BookingsPage({
  searchParams,
}: BookingsPageProps) {
  const resolvedSearchParams = await searchParams;

  const filters: BookingFilters = {
    status: resolvedSearchParams.status as any,
    paymentStatus: resolvedSearchParams.paymentStatus as any,
    dateFrom: resolvedSearchParams.dateFrom,
    dateTo: resolvedSearchParams.dateTo,
    search: resolvedSearchParams.search,
    page: parseInt(resolvedSearchParams.page || "1"),
    limit: parseInt(resolvedSearchParams.limit || "10"),
  };

  const { bookings, total } = await getBookings(filters);

  const stats = {
    total: mockBookings.length,
    confirmed: mockBookings.filter((b) => b.status === "confirmed").length,
    completed: mockBookings.filter((b) => b.status === "completed").length,
    pending: mockBookings.filter((b) => b.status === "pending").length,
    cancelled: mockBookings.filter((b) => b.status === "cancelled").length,
    totalRevenue: mockBookings
      .filter((b) => b.paymentStatus === "paid")
      .reduce((sum, b) => sum + b.amount, 0),
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Захиалгын удирдлага
            </h1>
            <p className="text-gray-600 mt-2">
              Платформ дээрх бүх захиалгыг удирдах болон хянах
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Нийт захиалга</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Нийт захиалга</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-green-600">
            {stats.confirmed}
          </div>
          <div className="text-sm text-gray-600">Баталгаажсан</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-purple-600">
            {stats.completed}
          </div>
          <div className="text-sm text-gray-600">Дууссан</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {stats.pending}
          </div>
          <div className="text-sm text-gray-600">Хүлээгдэж буй</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-indigo-600">
            ₮{stats.totalRevenue.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Нийт орлого</div>
        </div>
      </div>

      {/* Filters */}
      <BookingsFilters initialFilters={filters} />

      {/* Bookings Table */}
      <BookingsTable bookings={bookings} />
    </div>
  );
}
