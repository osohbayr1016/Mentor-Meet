import { NextRequest, NextResponse } from "next/server";

function generateReportsData(period: string = "30d") {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Generate user growth data
  const userGrowth = [];
  for (let i = 5; i >= 0; i--) {
    const month = new Date(currentYear, currentMonth - i, 1);
    const monthName = month.toLocaleDateString("en-US", { month: "short" });
    const baseStudents = 120 + (5 - i) * 30 + Math.floor(Math.random() * 20);
    const baseMentors = 25 + (5 - i) * 5 + Math.floor(Math.random() * 5);
    
    userGrowth.push({
      month: monthName,
      students: baseStudents,
      mentors: baseMentors,
      totalUsers: baseStudents + baseMentors,
    });
  }

  // Generate revenue data
  const revenueData = [];
  for (let i = 5; i >= 0; i--) {
    const month = new Date(currentYear, currentMonth - i, 1);
    const monthName = month.toLocaleDateString("en-US", { month: "short" });
    const baseRevenue = 2400000 + (5 - i) * 1200000 + Math.floor(Math.random() * 500000);
    const bookings = Math.floor(baseRevenue / 50000) + Math.floor(Math.random() * 20);
    
    revenueData.push({
      month: monthName,
      revenue: baseRevenue,
      bookings,
      averageBookingValue: Math.floor(baseRevenue / bookings),
    });
  }

  // Generate top mentors
  const mentorNames = [
    "Доктор Сарангэрэл", "Профессор Энхбаяр", "Магистр Оюунаа",
    "Доктор Батбаяр", "Профессор Цэцэг", "Багш Мөнхбат",
    "Доктор Энхжин", "Профессор Болд", "Магистр Цэцэг"
  ];

  const topMentors = mentorNames.slice(0, 8).map((name, index) => ({
    id: index + 1,
    name,
    bookings: 45 - (index * 3) + Math.floor(Math.random() * 10),
    revenue: (6750000 - (index * 500000)) + Math.floor(Math.random() * 1000000),
    rating: 4.9 - (index * 0.05) + (Math.random() * 0.1 - 0.05),
    completionRate: 95 - (index * 1) + Math.floor(Math.random() * 5),
    responseTime: 10 + (index * 2) + Math.floor(Math.random() * 5),
    categories: ["Математик", "Физик", "Хими", "Биологи"][Math.floor(Math.random() * 4)],
  }));

  // Generate category stats
  const categories = [
    { name: "Математик", color: "#3B82F6" },
    { name: "Физик", color: "#10B981" },
    { name: "Хими", color: "#F59E0B" },
    { name: "Биологи", color: "#EF4444" },
    { name: "Англи хэл", color: "#8B5CF6" },
    { name: "Бусад", color: "#6B7280" },
  ];

  const categoryStats = categories.map((category, index) => {
    const baseBookings = 85 - (index * 12) + Math.floor(Math.random() * 10);
    const baseRevenue = baseBookings * (120000 + Math.floor(Math.random() * 80000));
    const percentage = Math.floor((baseBookings / 300) * 100);
    
    return {
      category: category.name,
      bookings: baseBookings,
      revenue: baseRevenue,
      percentage,
      color: category.color,
      averageRating: 4.5 + Math.random() * 0.5,
      mentorCount: Math.floor(baseBookings / 8) + Math.floor(Math.random() * 3),
    };
  });

  // Generate performance metrics
  const performanceMetrics = {
    totalSessions: 1247 + Math.floor(Math.random() * 200),
    completionRate: 94.2 + (Math.random() * 3 - 1.5),
    averageSessionDuration: 75 + Math.floor(Math.random() * 20),
    customerSatisfaction: 4.7 + (Math.random() * 0.4 - 0.2),
    repeatBookingRate: 68.5 + (Math.random() * 10 - 5),
    averageResponseTime: 12 + Math.floor(Math.random() * 8),
    cancelationRate: 5.2 + (Math.random() * 3 - 1.5),
    noShowRate: 2.8 + (Math.random() * 2 - 1),
    averageBookingValue: 145000 + Math.floor(Math.random() * 50000),
    peakHours: ["14:00-16:00", "19:00-21:00"],
  };

  // Generate engagement metrics
  const engagementMetrics = {
    dailyActiveUsers: 450 + Math.floor(Math.random() * 100),
    weeklyActiveUsers: 1200 + Math.floor(Math.random() * 300),
    monthlyActiveUsers: 3400 + Math.floor(Math.random() * 500),
    averageSessionsPerUser: 2.8 + (Math.random() * 1.5 - 0.75),
    userRetentionRate: 76.3 + (Math.random() * 10 - 5),
    timeSpentPerSession: 45 + Math.floor(Math.random() * 20),
  };

  // Generate geographical data
  const geographicalData = [
    { region: "Улаанбаатар", users: 2100, percentage: 65, revenue: 28000000 },
    { region: "Дархан-Уул", users: 320, percentage: 10, revenue: 4200000 },
    { region: "Орхон", users: 280, percentage: 8.5, revenue: 3800000 },
    { region: "Сэлэнгэ", users: 180, percentage: 5.5, revenue: 2400000 },
    { region: "Хэнтий", users: 150, percentage: 4.5, revenue: 2000000 },
    { region: "Бусад", users: 210, percentage: 6.5, revenue: 2800000 },
  ];

  return {
    userGrowth,
    revenueData,
    topMentors,
    categoryStats,
    performanceMetrics,
    engagementMetrics,
    geographicalData,
    generatedAt: now.toISOString(),
    period,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30d";
    const reportType = searchParams.get("type") || "overview";

    const data = generateReportsData(period);

    // Filter data based on report type
    let filteredData = data;
    switch (reportType) {
      case "revenue":
        filteredData = {
          revenueData: data.revenueData,
          categoryStats: data.categoryStats,
          performanceMetrics: {
            totalSessions: data.performanceMetrics.totalSessions,
            averageBookingValue: data.performanceMetrics.averageBookingValue,
          },
          generatedAt: data.generatedAt,
          period: data.period,
        };
        break;
      case "users":
        filteredData = {
          userGrowth: data.userGrowth,
          engagementMetrics: data.engagementMetrics,
          geographicalData: data.geographicalData,
          generatedAt: data.generatedAt,
          period: data.period,
        };
        break;
      case "performance":
        filteredData = {
          performanceMetrics: data.performanceMetrics,
          topMentors: data.topMentors,
          categoryStats: data.categoryStats,
          generatedAt: data.generatedAt,
          period: data.period,
        };
        break;
      default:
        // Return all data for overview
        break;
    }

    return NextResponse.json({
      success: true,
      data: filteredData,
      meta: {
        reportType,
        period,
        generatedAt: new Date().toISOString(),
        dataPoints: Object.keys(filteredData).length - 2, // Exclude generatedAt and period
      }
    });

  } catch (error) {
    console.error("Admin reports API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reports data" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, reportType, period, filters } = body;

    switch (action) {
      case "generate":
        // Generate custom report
        const customData = generateReportsData(period);
        return NextResponse.json({
          success: true,
          data: customData,
          message: "Custom report generated successfully"
        });

      case "export":
        // Generate export
        return NextResponse.json({
          success: true,
          exportUrl: `/api/admin/export/reports?type=${reportType}&period=${period}`,
          message: "Report export generated successfully"
        });

      case "schedule":
        // Schedule report generation
        return NextResponse.json({
          success: true,
          scheduleId: `SCHED_${Date.now()}`,
          message: "Report scheduled successfully"
        });

      default:
        return NextResponse.json(
          { success: false, error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Admin reports POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process report action" },
      { status: 500 }
    );
  }
}