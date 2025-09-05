import { NextRequest, NextResponse } from "next/server";

interface AvailabilityRequest {
  start: string;
  end: string;
  mentorEmail: string;
  date: string;
  time: string;
}

interface MultipleAvailabilityRequest {
  availabilities: AvailabilityRequest[];
}

export async function POST(request: NextRequest) {
  try {
    // TODO: Get access token from Firebase for Google Calendar
    // For now, skip authentication in development

    const body = await request.json();

    // Check if it's a single availability or multiple availabilities
    let availabilities: AvailabilityRequest[] = [];

    if (body.availabilities && Array.isArray(body.availabilities)) {
      // Multiple availabilities
      availabilities = body.availabilities;
    } else if (
      body.start &&
      body.end &&
      body.mentorEmail &&
      body.date &&
      body.time
    ) {
      // Single availability (backward compatibility)
      availabilities = [body as AvailabilityRequest];
    } else {
      return NextResponse.json(
        {
          error:
            "Invalid request format. Expected either single availability or array of availabilities",
        },
        { status: 400 }
      );
    }

    const results = [];

    // Process each availability
    for (const availability of availabilities) {
      const { start, end, mentorEmail, date, time } = availability;

      // Validate required fields
      if (!start || !end || !mentorEmail || !date || !time) {
        results.push({
          date,
          time,
          success: false,
          error: "Missing required fields",
        });
        continue;
      }

      try {
        // Here you would typically save the availability to your database
        // For now, we'll just return success
        // In a real implementation, you would:
        // 1. Save to your mentor's availability schedule
        // 2. Update the mentor's calendar
        // 3. Make this time slot available for booking by mentees

        console.log("Mentor availability marked:", {
          mentorEmail,
          date,
          time,
          start,
          end,
        });

        results.push({
          date,
          time,
          success: true,
          message: "Availability marked successfully",
        });
      } catch (error) {
        console.error(`Error marking availability for ${date} ${time}:`, error);
        results.push({
          date,
          time,
          success: false,
          error: "Failed to mark availability",
        });
      }
    }

    const successfulResults = results.filter((r) => r.success);
    const failedResults = results.filter((r) => !r.success);

    return NextResponse.json({
      success: successfulResults.length > 0,
      message: `Successfully marked ${successfulResults.length} availability slots`,
      results,
      successfulCount: successfulResults.length,
      failedCount: failedResults.length,
    });
  } catch (error) {
    console.error("Error marking availability:", error);
    return NextResponse.json(
      { error: "Failed to mark availability" },
      { status: 500 }
    );
  }
}
