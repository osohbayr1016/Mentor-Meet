import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    if (!id) {
      return NextResponse.json(
        { error: "Mentor ID is required" },
        { status: 400 }
      );
    }

    // Call the server API
    const response = await axios.get(`http://localhost:8000/mentor/${id}`);

    if (response.status !== 200) {
      const errorData = response.data as { error: string };
      return NextResponse.json(
        { error: errorData.error || "Failed to fetch mentor" },
        { status: response.status }
      );
    }

    const mentorData = response.data;
    return NextResponse.json(mentorData);
  } catch (error) {
    console.error("Error fetching mentor:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
