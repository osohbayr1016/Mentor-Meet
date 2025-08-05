import { NextRequest, NextResponse } from "next/server";

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
<<<<<<< HEAD
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      }/mentor/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
=======
    const response = await fetch(`http://localhost:8000/mentor/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
>>>>>>> 104be8d (backend url fixed)

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || "Failed to fetch mentor" },
        { status: response.status }
      );
    }

    const mentorData = await response.json();
    return NextResponse.json(mentorData);
  } catch (error) {
    console.error("Error fetching mentor:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
