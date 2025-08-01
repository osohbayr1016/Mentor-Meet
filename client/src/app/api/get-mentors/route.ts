import { NextRequest, NextResponse } from "next/server";

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
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL ||
        "https://mentor-meet-o3rp.onrender.com"
      }/mentors?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || "Failed to fetch mentors" },
        { status: response.status }
      );
    }

    const mentorsData = await response.json();
    return NextResponse.json(mentorsData);
  } catch (error) {
    console.error("Error fetching mentors:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
