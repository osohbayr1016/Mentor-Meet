import { NextRequest, NextResponse } from "next/server";
import { checkAdminPermission } from "../../../../lib/admin-auth";

export async function GET(request: NextRequest) {
    try {
        // Check admin authentication
        const { authorized, session } = await checkAdminPermission();
        
        if (!authorized) {
            return NextResponse.json(
                { success: false, error: "Unauthorized access" },
                { status: 401 }
            );
        }
        // In a real implementation, you would fetch from your database
        // For now, we'll return dynamic mock data based on current date/time

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentDay = now.getDate();

        // Generate dynamic stats that change based on current time
        const baseUsers = 1200 + (currentMonth * 50) + currentDay;
        const baseMentors = 45 + currentMonth + Math.floor(currentDay / 2);
        const baseBookings = 180 + (currentMonth * 20) + (currentDay * 3);
        const baseRevenue = 45280000 + (currentMonth * 2000000) + (currentDay * 100000);

        const stats = {
            totalUsers: baseUsers,
            totalMentors: baseMentors,
            activeBookings: baseBookings,
            monthlyRevenue: baseRevenue,
            totalRevenue: baseRevenue * 12,
            averageRating: 4.7 + (Math.random() * 0.3),
            pendingMentorApprovals: Math.floor(Math.random() * 15) + 5,
            conversionRate: 68.5 + (Math.random() * 10),
            // Growth percentages (dynamic)
            userGrowth: 12 + Math.floor(Math.random() * 8),
            mentorGrowth: 8 + Math.floor(Math.random() * 5),
            bookingGrowth: 15 + Math.floor(Math.random() * 10),
            revenueGrowth: 23 + Math.floor(Math.random() * 12),
        };

        // Recent activity (dynamic based on time)
        const recentActivity = [
            {
                id: 1,
                type: "booking",
                message: "Шинэ захиалга: Болд Батбаяр → Доктор Сарангэрэл",
                timestamp: new Date(now.getTime() - Math.random() * 3600000).toISOString(),
                status: "new"
            },
            {
                id: 2,
                type: "payment",
                message: `Төлбөр хийгдсэн: ₮${(150000 + Math.floor(Math.random() * 100000)).toLocaleString()}`,
                timestamp: new Date(now.getTime() - Math.random() * 7200000).toISOString(),
                status: "completed"
            },
            {
                id: 3,
                type: "mentor",
                message: "Багш бүртгүүлсэн: Профессор Энхбаяр",
                timestamp: new Date(now.getTime() - Math.random() * 10800000).toISOString(),
                status: "pending"
            },
            {
                id: 4,
                type: "user",
                message: "Шинэ суралцагч: Цэцэг Мөнхбат",
                timestamp: new Date(now.getTime() - Math.random() * 14400000).toISOString(),
                status: "new"
            }
        ];

        return NextResponse.json({
            success: true,
            data: {
                stats,
                recentActivity,
                lastUpdated: now.toISOString()
            }
        });

    } catch (error) {
        console.error("Admin dashboard API error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch dashboard data" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        // Check admin authentication
        const { authorized, session } = await checkAdminPermission();
        
        if (!authorized) {
            return NextResponse.json(
                { success: false, error: "Unauthorized access" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { action, data } = body;

        switch (action) {
            case "refresh":
                // Trigger data refresh
                return NextResponse.json({
                    success: true,
                    message: "Dashboard data refreshed"
                });

            case "export":
                // Generate export data
                return NextResponse.json({
                    success: true,
                    exportUrl: "/api/admin/export/dashboard",
                    message: "Export generated successfully"
                });

            default:
                return NextResponse.json(
                    { success: false, error: "Invalid action" },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error("Admin dashboard POST error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to process request" },
            { status: 500 }
        );
    }
}