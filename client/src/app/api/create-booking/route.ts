import { NextRequest, NextResponse } from "next/server";

interface CreateBookingRequest {
  mentorId: string;
  studentId: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  category: string;
  notes?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateBookingRequest = await request.json();
    const {
      mentorId,
      studentId,
      date,
      time,
      duration,
      price,
      category,
      notes,
    } = body;

    // Validate required fields
    if (!mentorId || !studentId || !date || !time || !price || !category) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: mentorId, studentId, date, time, price, category",
        },
        { status: 400 }
      );
    }

    // Create booking on the server
    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mentorId,
        studentId,
        date,
        time,
        duration: duration || 60,
        price,
        category,
        notes,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json({
        success: true,
        booking: data.booking,
        message: "Booking created successfully",
      });
    } else {
      return NextResponse.json(
        {
          error: data.message || "Failed to create booking",
          details: data,
        },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
