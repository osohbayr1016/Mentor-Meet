import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
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
      `${
        process.env.NEXT_PUBLIC_API_URL ||
        "https://mentor-meet-h0tx.onrender.com"
      }/bookings/${bookingId}/cancel`,
      {
        method: "PUT",
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
          message: data.message || "Failed to cancel booking",
        },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to cancel booking",
      },
      { status: 500 }
    );
  }
}
