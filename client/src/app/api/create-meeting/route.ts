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

        console.log('Create meeting request:', {
            start,
            end,
            mentorEmail,
            menteeEmail,
            title,
            hasAccessToken: !!session.accessToken
        });

        // Validate required fields
        if (!start || !end || !mentorEmail || !menteeEmail) {
            console.error('Missing required fields:', { start, end, mentorEmail, menteeEmail });
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

    } catch (error: any) {
        console.error("Error creating meeting:", error);

        // Provide more specific error messages
        let errorMessage = "Failed to create meeting";
        let statusCode = 500;

        if (error.message?.includes("insufficient permissions")) {
            errorMessage = "Calendar access permission required";
            statusCode = 403;
        } else if (error.message?.includes("invalid_grant")) {
            errorMessage = "OAuth token expired, please sign in again";
            statusCode = 401;
        } else if (error.code === 401) {
            errorMessage = "Authentication failed";
            statusCode = 401;
        }

        return NextResponse.json(
            { error: errorMessage, details: error.message },
            { status: statusCode }
        );
    }
} 