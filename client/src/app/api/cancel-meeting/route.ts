import { NextRequest, NextResponse } from "next/server";
import { createGoogleCalendarClient } from "../../../lib/google-calendar";

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventId } = body;

    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    // TODO: Get access token from Firebase for Google Calendar
    // For now, skip Google Calendar integration
    const accessToken = "placeholder"; // Replace with actual token from Firebase
    const calendar = createGoogleCalendarClient(accessToken);

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
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    if (error.code === 403) {
      return NextResponse.json(
        {
          error: "Permission denied. You can only cancel meetings you created.",
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "Failed to cancel meeting" },
      { status: 500 }
    );
  }
}
