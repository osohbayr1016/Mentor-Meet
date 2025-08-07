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
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      }/get-booking-mentor/${studentId}`
    );

    const data = response.data as {
      success: boolean;
      message: string;
      data: any[];
    };

    if (response.status === 200) {
      return NextResponse.json({
        success: data.success,
        message: data.message,
        data: data.data,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to fetch booking mentor data",
        },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Error fetching booking mentor data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch booking mentor data",
      },
      { status: 500 }
    );
  }
}
