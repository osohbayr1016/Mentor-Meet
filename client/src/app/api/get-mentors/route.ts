import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const subCategory = searchParams.get("subCategory");

    // Build query string
    const queryParams = new URLSearchParams();
    if (category) queryParams.append("category", category);
    if (subCategory) queryParams.append("subCategory", subCategory);

    // Call the server API
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const response = await axios.get(
      `${API_BASE_URL}/mentors?${queryParams.toString()}`
    );

    if (response.status !== 200) {
      const errorData = response.data as { error: string };
      return NextResponse.json(
        { error: errorData.error || "Failed to fetch mentors" },
        { status: response.status }
      );
    }

    const mentorsData = response.data;
    return NextResponse.json(mentorsData);
  } catch (error) {
    console.error("Error fetching mentors:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
