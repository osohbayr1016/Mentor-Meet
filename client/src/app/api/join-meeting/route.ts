import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, studentId } = body;

    if (!bookingId || !studentId) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking ID and Student ID are required",
        },
        { status: 400 }
      );
    }

    const response = await fetch(
      `http://localhost:8000/bookings/${bookingId}/join`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentId }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to join meeting",
        },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Error joining meeting:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to join meeting",
      },
      { status: 500 }
    );
  }
}
