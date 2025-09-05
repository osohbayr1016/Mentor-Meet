import { NextRequest, NextResponse } from "next/server";
import { createGoogleMeetEvent } from "../../../lib/google-calendar";

interface TestGenerateMeetRequest {
  bookingId: string;
  mentorEmail: string;
  studentEmail: string;
  date: string;
  time: string;
  title?: string;
}

export async function POST(request: NextRequest) {
  try {
    // TODO: Get session from Firebase

    console.log(
      "Test Generate Meet - Firebase session debug not implemented yet"
    );

    const body: TestGenerateMeetRequest = await request.json();
    const { bookingId, mentorEmail, studentEmail, date, time, title } = body;

    // Validate required fields
    if (!bookingId || !mentorEmail || !studentEmail || !date || !time) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Missing required fields: bookingId, mentorEmail, studentEmail, date, time",
        },
        { status: 400 }
      );
    }

    // Create DateTime objects for the meeting (1 hour duration by default)
    const meetingDate = new Date(`${date}T${time}`);
    const endTime = new Date(meetingDate.getTime() + 60 * 60 * 1000); // 1 hour

    const meetingData = {
      start: meetingDate.toISOString(),
      end: endTime.toISOString(),
      mentorEmail: mentorEmail,
      menteeEmail: studentEmail,
      title: title || "Mentor Meet - Mentorship Session",
      description: `Mentorship session between ${mentorEmail} and ${studentEmail}. Booking ID: ${bookingId}`,
    };

    console.log("Creating test Google Meet:", {
      bookingId,
      meetingDate: meetingDate.toISOString(),
      endTime: endTime.toISOString(),
      mentorEmail,
      studentEmail,
    });

    // Create Google Meet event
    const meetingResponse = await createGoogleMeetEvent(
      "placeholder-access-token" as string, // TODO: Get from Firebase
      meetingData
    );

    // Try to update the booking in the backend with the meeting link
    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    try {
      const updateResponse = await fetch(
        `${API_BASE_URL}/bookings/${bookingId}/meeting-link`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            meetingLink: meetingResponse.hangoutLink,
            calendarEventId: meetingResponse.eventId,
            meetingStartTime: meetingResponse.startTime,
            meetingEndTime: meetingResponse.endTime,
          }),
        }
      );

      if (updateResponse.ok) {
        console.log("Successfully updated booking with meeting link");
      } else {
        console.warn("Failed to update booking, but meeting link was created");
      }
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
        calendarLink: `https://calendar.google.com/calendar/event?eid=${meetingResponse.eventId}`,
      },
    });
  } catch (error) {
    console.error("Error in test generate meeting:", error);

    let errorMessage = "Failed to generate meeting link";
    if (error instanceof Error) {
      if (error.message.includes("нэвтрэх эрх")) {
        errorMessage = "Google нэвтрэх эрх хэрэгтэй - дахин нэвтэрнэ үү";
      } else if (error.message.includes("календарт хандах")) {
        errorMessage =
          "Google календарт хандах эрх хэрэгтэй - програмд зөвшөөрөл өгнө үү";
      } else if (error.message.includes("Authentication")) {
        errorMessage =
          "Google authentication failed. Please sign in with Google again.";
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
