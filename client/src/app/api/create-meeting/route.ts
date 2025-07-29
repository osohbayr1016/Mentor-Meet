import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { createGoogleMeetEvent, MeetingRequest } from "../../../lib/google-calendar";

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

        const body: MeetingRequest = await request.json();
        const { start, end, mentorEmail, menteeEmail, title, description } = body;

        // Validate required fields
        if (!start || !end || !mentorEmail || !menteeEmail) {
            return NextResponse.json(
                { error: "Missing required fields: start, end, mentorEmail, menteeEmail" },
                { status: 400 }
            );
        }

        // Create the meeting using Google Calendar API
        const meetingData = await createGoogleMeetEvent(session.accessToken, {
            start,
            end,
            mentorEmail,
            menteeEmail,
            title,
            description,
        });

        return NextResponse.json({
            success: true,
            hangoutLink: meetingData.hangoutLink,
            eventId: meetingData.eventId,
            startTime: meetingData.startTime,
            endTime: meetingData.endTime,
        });

    } catch (error) {
        console.error("Error creating meeting:", error);
        return NextResponse.json(
            { error: "Failed to create meeting" },
            { status: 500 }
        );
    }
} 