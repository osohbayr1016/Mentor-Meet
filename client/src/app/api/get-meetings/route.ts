import { NextRequest, NextResponse } from "next/server";
import { createGoogleCalendarClient } from "../../../lib/google-calendar";

export async function GET(request: NextRequest) {
  try {
    // TODO: Get access token from Firebase for Google Calendar
    // For now, skip authentication in development

    // Create Google Calendar client
    // TODO: Get access token from Firebase
    const accessToken = "placeholder"; // Replace with actual token from Firebase
    const calendar = createGoogleCalendarClient(accessToken);

    // Get upcoming events from the primary calendar
    const now = new Date();
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: now.toISOString(),
      timeMax: oneMonthFromNow.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
      q: "Mentorship Session", // Filter for mentorship sessions
    });

    const events = response.data.items || [];

    // Format the events for the frontend
    const meetings = events
      .filter((event) => event.conferenceData?.entryPoints?.[0]?.uri) // Only include events with Google Meet links
      .map((event) => ({
        eventId: event.id,
        hangoutLink: event.conferenceData?.entryPoints?.[0]?.uri,
        startTime: event.start?.dateTime || event.start?.date,
        endTime: event.end?.dateTime || event.end?.date,
        title: event.summary || "Mentorship Session",
        description: event.description,
        attendees:
          event.attendees?.map((attendee) => ({ email: attendee.email })) || [],
      }));

    return NextResponse.json({
      success: true,
      meetings,
      total: meetings.length,
    });
  } catch (error) {
    console.error("Error fetching meetings:", error);
    return NextResponse.json(
      { error: "Failed to fetch meetings" },
      { status: 500 }
    );
  }
}
