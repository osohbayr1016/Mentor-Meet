import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { createGoogleMeetEvent } from "../../../lib/google-calendar";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.accessToken) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Authentication required. Please sign in with Google first."
                },
                { status: 401 }
            );
        }

        // Get test data from request body
        const body = await request.json();
        const {
            mentorEmail = session.user?.email,
            menteeEmail = "test.student@example.com",
            title = "Test Google Meet Session",
            description = "This is a test Google Meet session",
            duration = 60 // minutes
        } = body;

        // Create test meeting for 30 minutes from now
        const startTime = new Date();
        startTime.setMinutes(startTime.getMinutes() + 30);

        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + duration);

        const meetingData = {
            start: startTime.toISOString(),
            end: endTime.toISOString(),
            mentorEmail: mentorEmail,
            menteeEmail: menteeEmail,
            title: title,
            description: description
        };

        console.log("Creating test Google Meet with data:", meetingData);

        const meetingResponse = await createGoogleMeetEvent(
            session.accessToken as string,
            meetingData
        );

        return NextResponse.json({
            success: true,
            message: "Test Google Meet created successfully!",
            data: {
                meetingLink: meetingResponse.hangoutLink,
                eventId: meetingResponse.eventId,
                startTime: meetingResponse.startTime,
                endTime: meetingResponse.endTime,
                calendarLink: `https://calendar.google.com/calendar/event?eid=${meetingResponse.eventId}`
            }
        });

    } catch (error) {
        console.error("Error creating test Google Meet:", error);

        let errorMessage = "Failed to create test meeting";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return NextResponse.json(
            {
                success: false,
                message: errorMessage,
                error: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}