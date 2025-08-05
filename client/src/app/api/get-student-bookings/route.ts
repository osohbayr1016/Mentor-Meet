import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json(
        {
          success: false,
          message: "Student ID is required",
        },
        { status: 400 }
      );
    }

    const response = await axios.get(
      `http://localhost:8000/bookings/${studentId}`
    );

    const data = response.data as {
      success: boolean;
      message: string;
    };

    if (response.status === 200) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to fetch bookings",
        },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Error fetching student bookings:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch bookings",
      },
      { status: 500 }
    );
  }
}
