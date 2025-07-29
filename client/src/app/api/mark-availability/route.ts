import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

interface AvailabilityRequest {
    start: string;
    end: string;
    mentorEmail: string;
    date: string;
    time: string;
}

export async function POST(request: NextRequest) {
    try {
        // Get the session to access the access token
        const session = await getServerSession(authOptions);

        if (!session?.accessToken) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        const body: AvailabilityRequest = await request.json();
        const { start, end, mentorEmail, date, time } = body;

        // Validate required fields
        if (!start || !end || !mentorEmail || !date || !time) {
            return NextResponse.json(
                { error: "Missing required fields: start, end, mentorEmail, date, time" },
                { status: 400 }
            );
        }

        // Here you would typically save the availability to your database
        // For now, we'll just return success
        // In a real implementation, you would:
        // 1. Save to your mentor's availability schedule
        // 2. Update the mentor's calendar
        // 3. Make this time slot available for booking by mentees

        console.log("Mentor availability marked:", {
            mentorEmail,
            date,
            time,
            start,
            end
        });

        return NextResponse.json({
            success: true,
            message: "Availability marked successfully",
            availability: {
                date,
                time,
                start,
                end,
                mentorEmail
            }
        });

    } catch (error) {
        console.error("Error marking availability:", error);
        return NextResponse.json(
            { error: "Failed to mark availability" },
            { status: 500 }
        );
    }
} 