import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { createGoogleMeetEvent } from "../../../lib/google-calendar";

interface ConfirmBookingRequest {
    bookingId: string;
    mentorEmail: string;
    studentEmail: string;
    sessionDate: string; // ISO string
    duration: number; // in minutes
    subject?: string;
    description?: string;
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.accessToken) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Google нэвтрэх эрх хэрэгтэй. Google-ээр нэвтэрнэ үү.",
                    error: "NO_ACCESS_TOKEN"
                },
                { status: 401 }
            );
        }

        const body: ConfirmBookingRequest = await request.json();
        const {
            bookingId,
            mentorEmail,
            studentEmail,
            sessionDate,
            duration,
            subject,
            description
        } = body;

        // Validate required fields
        if (!bookingId || !mentorEmail || !studentEmail || !sessionDate || !duration) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Шаардлагатай мэдээлэл дутуу байна"
                },
                { status: 400 }
            );
        }

        // Create DateTime objects for the meeting
        const startTime = new Date(sessionDate);
        const endTime = new Date(startTime.getTime() + (duration * 60 * 1000));

        const meetingData = {
            start: startTime.toISOString(),
            end: endTime.toISOString(),
            mentorEmail: mentorEmail,
            menteeEmail: studentEmail,
            title: subject || "Багш-Оюутны хичээл",
            description: description || `${mentorEmail} болон ${studentEmail} хоорондын хичээл. Захиалгын ID: ${bookingId}`
        };

        console.log("Creating Google Meet for confirmed booking:", {
            bookingId,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString()
        });

        // Create Google Meet event
        const meetingResponse = await createGoogleMeetEvent(
            session.accessToken as string,
            meetingData
        );

        // Update booking with Google Meet link on the backend
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        let backendUpdateSuccess = false;

        try {
            const updateResponse = await fetch(`${API_BASE_URL}/bookings/${bookingId}/meeting-link`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    meetingLink: meetingResponse.hangoutLink,
                    calendarEventId: meetingResponse.eventId,
                    meetingStartTime: meetingResponse.startTime,
                    meetingEndTime: meetingResponse.endTime
                }),
            });

            backendUpdateSuccess = updateResponse.ok;
            if (!backendUpdateSuccess) {
                console.warn("Failed to update booking in backend, but meeting was created:", await updateResponse.text());
            }
        } catch (updateError) {
            console.error("Failed to update booking with meeting link:", updateError);
            // Continue anyway, we'll return the link to the frontend
        }

        return NextResponse.json({
            success: true,
            message: "Google Meet холбоос амжилттай үүсгэгдлээ!",
            data: {
                bookingId,
                meetingLink: meetingResponse.hangoutLink,
                calendarEventId: meetingResponse.eventId,
                startTime: meetingResponse.startTime,
                endTime: meetingResponse.endTime,
                calendarLink: `https://calendar.google.com/calendar/event?eid=${meetingResponse.eventId}`,
                backendUpdated: backendUpdateSuccess
            }
        });

    } catch (error) {
        console.error("Error confirming booking with Google Meet:", error);

        let errorMessage = "Уулзалт үүсгэхэд алдаа гарлаа";
        if (error instanceof Error) {
            if (error.message.includes("нэвтрэх эрх")) {
                errorMessage = "Google нэвтрэх эрх хэрэгтэй. Дахин нэвтэрнэ үү.";
            } else if (error.message.includes("календарт хандах эрх")) {
                errorMessage = "Google календарт хандах эрх хэрэгтэй. Програмд зөвшөөрөл өгнө үү.";
            } else if (error.message.includes("квота")) {
                errorMessage = "Түр хугацаанд хэт олон хүсэлт илгээгдсэн. Дахин оролдоно уу.";
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