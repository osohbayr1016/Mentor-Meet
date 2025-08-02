import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { createGoogleCalendarClient } from "../../../lib/google-calendar";

export async function DELETE(request: NextRequest) {
    try {
        // Get the session to access the access token
        const session = await getServerSession(authOptions);

        if (!session?.accessToken) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { eventId } = body;

        if (!eventId) {
            return NextResponse.json(
                { error: "Event ID is required" },
                { status: 400 }
            );
        }

        // Create Google Calendar client
        const calendar = createGoogleCalendarClient(session.accessToken);

        // Delete the event from Google Calendar
        await calendar.events.delete({
            calendarId: "primary",
            eventId: eventId,
        });

        return NextResponse.json({
            success: true,
            message: "Meeting canceled successfully",
        });

    } catch (error: any) {
        console.error("Error canceling meeting:", error);

        // Handle specific Google Calendar API errors
        if (error.code === 404) {
            return NextResponse.json(
                { error: "Meeting not found" },
                { status: 404 }
            );
        }

        if (error.code === 403) {
            return NextResponse.json(
                { error: "Permission denied. You can only cancel meetings you created." },
                { status: 403 }
            );
        }

        return NextResponse.json(
            { error: "Failed to cancel meeting" },
            { status: 500 }
        );
    }
}