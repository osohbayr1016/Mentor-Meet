import { NextRequest, NextResponse } from "next/server";
import {
  createGoogleMeetEvent,
  MeetingRequest,
} from "../../../lib/google-calendar";

export async function POST(request: NextRequest) {
  try {
    // TODO: Get access token from Firebase for Google Calendar
    // For now, skip authentication in development

    const body: MeetingRequest = await request.json();
    const { start, end, mentorEmail, menteeEmail, title, description } = body;

    // Validate required fields
    if (!start || !end || !mentorEmail || !menteeEmail) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: start, end, mentorEmail, menteeEmail",
        },
        { status: 400 }
      );
    }

    // Create the meeting using Google Calendar API
    // TODO: Get access token from Firebase
    const accessToken = "placeholder"; // Replace with actual token from Firebase
    const meetingData = await createGoogleMeetEvent(accessToken, {
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
