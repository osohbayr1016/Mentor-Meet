import { MentorProfile, MentorFilters } from "../../../types/admin";
import MentorsTable from "../../../components/admin/MentorsTable";
import MentorsFilters from "../../../components/admin/MentorsFilters";

// Mock data for development
const mockMentors: MentorProfile[] = [
  {
    _id: "1",
    userId: "user1",
    user: {
      _id: "user1",
      name: "Батбаяр Мөнх",
      email: "batbayar@example.com",
      role: "mentor",
      createdAt: "2024-01-15T00:00:00Z",
      updatedAt: "2024-01-15T00:00:00Z",
      isActive: true,
    },
    category: "Програм хангамж",
    subcategory: "Web хөгжүүлэлт",
    experience: "5+ жил",
    bio: "Full-stack хөгжүүлэгч, React болон Node.js-д мэргэшсэн",
    hourlyRate: 50000,
    approved: true,
    specializations: ["React", "Node.js", "MongoDB"],
    totalBookings: 45,
    rating: 4.8,
    totalEarnings: 2250000,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    _id: "2",
    userId: "user2",
    user: {
      _id: "user2",
      name: "Сувдаа Болор",
      email: "suvdaa@example.com",
      role: "mentor",
      createdAt: "2024-02-20T00:00:00Z",
      updatedAt: "2024-02-20T00:00:00Z",
      isActive: true,
    },
    category: "Маркетинг",
    subcategory: "Digital Marketing",
    experience: "3+ жил",
    bio: "Digital маркетингийн мэргэжилтэн, SEO болон SEM-д мэргэшсэн",
    hourlyRate: 40000,
    approved: false,
    specializations: ["SEO", "Google Ads", "Facebook Ads"],
    totalBookings: 0,
    rating: 0,
    totalEarnings: 0,
    createdAt: "2024-02-20T00:00:00Z",
    updatedAt: "2024-02-20T00:00:00Z",
  },
  {
    _id: "3",
    userId: "user3",
    user: {
      _id: "user3",
      name: "Энхбат Ганбат",
      email: "enhbat@example.com",
      role: "mentor",
      createdAt: "2023-12-10T00:00:00Z",
      updatedAt: "2023-12-10T00:00:00Z",
      isActive: true,
    },
    category: "Дизайн",
    subcategory: "UI/UX Design",
    experience: "7+ жил",
    bio: "UI/UX дизайнер, хэрэглэгчийн туршлагын дизайнд мэргэшсэн",
    hourlyRate: 60000,
    approved: true,
    specializations: ["Figma", "Adobe XD", "User Research"],
    totalBookings: 78,
    rating: 4.9,
    totalEarnings: 4680000,
    createdAt: "2023-12-10T00:00:00Z",
    updatedAt: "2023-12-10T00:00:00Z",
  },
  {
    _id: "4",
    userId: "user4",
    user: {
      _id: "user4",
      name: "Оюунаа Сэргэлэн",
      email: "oyunaa@example.com",
      role: "mentor",
      createdAt: "2024-03-05T00:00:00Z",
      updatedAt: "2024-03-05T00:00:00Z",
      isActive: true,
    },
    category: "Бизнес",
    subcategory: "Startup зөвлөгөө",
    experience: "10+ жил",
    bio: "Startup зөвөлгөө өгдөг, олон амжилттай компани байгуулсан туршлагатай",
    hourlyRate: 80000,
    approved: false,
    specializations: ["Business Strategy", "Fundraising", "Team Building"],
    totalBookings: 0,
    rating: 0,
    totalEarnings: 0,
    createdAt: "2024-03-05T00:00:00Z",
    updatedAt: "2024-03-05T00:00:00Z",
  },
];

interface MentorsPageProps {
  searchParams: Promise<{
    approved?: string;
    category?: string;
    search?: string;
    page?: string;
    limit?: string;
  }>;
}

async function getMentors(
  filters: MentorFilters
): Promise<{ mentors: MentorProfile[]; total: number }> {
  try {
    // In production, fetch from your API
    // const queryParams = new URLSearchParams();
    // if (filters.approved !== undefined) queryParams.set('approved', filters.approved.toString());
    // if (filters.category) queryParams.set('category', filters.category);
    // if (filters.search) queryParams.set('search', filters.search);
    // if (filters.page) queryParams.set('page', filters.page.toString());
    // if (filters.limit) queryParams.set('limit', filters.limit.toString());

    // const response = await fetch(`${process.env.API_URL}/admin/mentors?${queryParams}`);
    // if (response.ok) {
    //   return await response.json();
    // }

    // Filter mock data based on filters
    let filteredMentors = mockMentors;

    if (filters.approved !== undefined) {
      filteredMentors = filteredMentors.filter(
        (mentor) => mentor.approved === filters.approved
      );
    }

    if (filters.category) {
      filteredMentors = filteredMentors.filter((mentor) =>
        mentor.category.toLowerCase().includes(filters.category!.toLowerCase())
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredMentors = filteredMentors.filter(
        (mentor) =>
          mentor.user?.name.toLowerCase().includes(searchLower) ||
          mentor.user?.email.toLowerCase().includes(searchLower) ||
          mentor.category.toLowerCase().includes(searchLower)
      );
    }

    return {
      mentors: filteredMentors,
      total: filteredMentors.length,
    };
  } catch (error) {
    console.error("Failed to fetch mentors:", error);
    return {
      mentors: mockMentors,
      total: mockMentors.length,
    };
  }
}

export default async function MentorsPage({ searchParams }: MentorsPageProps) {
  const resolvedSearchParams = await searchParams;

  const filters: MentorFilters = {
    approved:
      resolvedSearchParams.approved === "true"
        ? true
        : resolvedSearchParams.approved === "false"
        ? false
        : undefined,
    category: resolvedSearchParams.category,
    search: resolvedSearchParams.search,
    page: parseInt(resolvedSearchParams.page || "1"),
    limit: parseInt(resolvedSearchParams.limit || "10"),
  };

  const { mentors, total } = await getMentors(filters);

  const stats = {
    total: mockMentors.length,
    approved: mockMentors.filter((m) => m.approved).length,
    pending: mockMentors.filter((m) => !m.approved).length,
    active: mockMentors.filter((m) => m.user?.isActive).length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Багш нарын удирдлага
            </h1>
            <p className="text-gray-600 mt-2">
              Платформ дээрх бүх багш нарыг удирдах, зөвшөөрөх болон хянах
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Нийт багш</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Нийт багш</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-green-600">
            {stats.approved}
          </div>
          <div className="text-sm text-gray-600">Зөвшөөрөгдсөн</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {stats.pending}
          </div>
          <div className="text-sm text-gray-600">Хүлээгдэж буй</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-purple-600">
            {stats.active}
          </div>
          <div className="text-sm text-gray-600">Идэвхтэй</div>
        </div>
      </div>

      {/* Filters */}
      <MentorsFilters initialFilters={filters} />

      {/* Mentors Table */}
      <MentorsTable mentors={mentors} />
    </div>
  );
}
