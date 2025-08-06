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

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const response = await fetch(
      `${API_BASE_URL}/bookings/${bookingId}/join`,
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
