import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { createGoogleMeetEvent } from "../../../lib/google-calendar";

interface GenerateMeetingRequest {
    bookingId: string;
    mentorEmail: string;
    studentEmail: string;
    date: string;
    time: string;
    duration: number;
    title?: string;
    description?: string;
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        // Debug session information
        console.log("Session debug:", {
            hasSession: !!session,
            hasAccessToken: !!session?.accessToken,
            tokenLength: session?.accessToken?.length,
            userEmail: session?.user?.email,
            expiresAt: session?.expiresAt,
        });

        if (!session) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No session found. Please sign in with Google first.",
                    error: "NO_SESSION"
                },
                { status: 401 }
            );
        }

        if (!session?.accessToken) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No Google access token found. Please sign out and sign in again with Google to grant calendar permissions.",
                    error: "NO_ACCESS_TOKEN"
                },
                { status: 401 }
            );
        }

        const body: GenerateMeetingRequest = await request.json();
        const {
            bookingId,
            mentorEmail,
            studentEmail,
            date,
            time,
            duration,
            title,
            description
        } = body;

        // Validate required fields
        if (!bookingId || !mentorEmail || !studentEmail || !date || !time || !duration) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Missing required fields: bookingId, mentorEmail, studentEmail, date, time, duration"
                },
                { status: 400 }
            );
        }

        // Create DateTime objects for the meeting
        const meetingDate = new Date(`${date}T${time}`);
        const endTime = new Date(meetingDate.getTime() + (duration * 60 * 1000));

        const meetingData = {
            start: meetingDate.toISOString(),
            end: endTime.toISOString(),
            mentorEmail: mentorEmail,
            menteeEmail: studentEmail,
            title: title || "Mentorship Session",
            description: description || `Mentorship session between ${mentorEmail} and ${studentEmail}. Booking ID: ${bookingId}`
        };

        console.log("Creating Google Meet for paid booking:", {
            bookingId,
            meetingDate: meetingDate.toISOString(),
            endTime: endTime.toISOString()
        });

        // Create Google Meet event
        const meetingResponse = await createGoogleMeetEvent(
            session.accessToken as string,
            meetingData
        );

        // Update booking with Google Meet link on the backend
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        try {
            await fetch(`${API_BASE_URL}/bookings/${bookingId}/meeting-link`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    meetingLink: meetingResponse.hangoutLink,
                    calendarEventId: meetingResponse.eventId
                }),
            });
        } catch (updateError) {
            console.error("Failed to update booking with meeting link:", updateError);
            // Continue anyway, we'll return the link to the frontend
        }

        return NextResponse.json({
            success: true,
            message: "Google Meet link generated successfully!",
            data: {
                bookingId,
                meetingLink: meetingResponse.hangoutLink,
                calendarEventId: meetingResponse.eventId,
                startTime: meetingResponse.startTime,
                endTime: meetingResponse.endTime,
                calendarLink: `https://calendar.google.com/calendar/event?eid=${meetingResponse.eventId}`
            }
        });

    } catch (error) {
        console.error("Error generating Google Meet after payment:", error);

        let errorMessage = "Failed to generate meeting link";
        if (error instanceof Error) {
            if (error.message.includes("Authentication")) {
                errorMessage = "Google authentication failed. Please ensure the mentor is signed in with Google.";
            } else if (error.message.includes("Calendar")) {
                errorMessage = "Failed to create calendar event. Please check Google Calendar permissions.";
            } else {
                errorMessage = error.message;
            }
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