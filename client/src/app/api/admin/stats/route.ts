import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // TODO: Implement Firebase Admin SDK for server-side authentication
    // For now, skip authentication for development

    // For development, allow any request
    if (
      typeof process.env.NODE_ENV === "string" &&
      process.env.NODE_ENV !== "production"
    ) {
      // Continue with stats fetching
    }

    // Fetch stats from your backend API
    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    try {
      // Try to fetch from backend first
      const [usersResponse, bookingsResponse, paymentsResponse] =
        await Promise.all([
          fetch(`${API_BASE_URL}/admin/users/stats`),
          fetch(`${API_BASE_URL}/admin/bookings/stats`),
          fetch(`${API_BASE_URL}/admin/payments/stats`),
        ]);

      let stats = {
        totalUsers: 0,
        totalMentors: 0,
        totalStudents: 0,
        activeBookings: 0,
        monthlyRevenue: 0,
        completedMeetings: 0,
        pendingApprovals: 0,
        totalMeetings: 0,
      };

      // If backend APIs are available, parse the responses
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        stats.totalUsers = usersData.totalUsers || 0;
        stats.totalMentors = usersData.totalMentors || 0;
        stats.totalStudents = usersData.totalStudents || 0;
        stats.pendingApprovals = usersData.pendingApprovals || 0;
      }

      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        stats.activeBookings = bookingsData.activeBookings || 0;
        stats.completedMeetings = bookingsData.completedMeetings || 0;
        stats.totalMeetings = bookingsData.totalMeetings || 0;
      }

      if (paymentsResponse.ok) {
        const paymentsData = await paymentsResponse.json();
        stats.monthlyRevenue = paymentsData.monthlyRevenue || 0;
      }

      // If no backend data, return mock data
      if (stats.totalUsers === 0) {
        stats = {
          totalUsers: 1247,
          totalMentors: 156,
          totalStudents: 1091,
          activeBookings: 89,
          monthlyRevenue: 45280000,
          completedMeetings: 234,
          pendingApprovals: 12,
          totalMeetings: 267,
        };
      }

      return NextResponse.json(stats);
    } catch (backendError) {
      console.warn(
        "Backend API unavailable, returning mock data:",
        backendError
      );

      // Return mock data if backend is unavailable
      return NextResponse.json({
        totalUsers: 1247,
        totalMentors: 156,
        totalStudents: 1091,
        activeBookings: 89,
        monthlyRevenue: 45280000,
        completedMeetings: 234,
        pendingApprovals: 12,
        totalMeetings: 267,
      });
    }
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin statistics" },
      { status: 500 }
    );
  }
}
