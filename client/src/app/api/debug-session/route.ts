import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // TODO: Implement Firebase session debugging
    return NextResponse.json({
      message:
        "Firebase authentication - session debugging not yet implemented",
      isAuthenticated: false,
      session: null,
      headers: Object.fromEntries(request.headers.entries()),
    });
  } catch (error) {
    console.error("Error in debug session:", error);
    return NextResponse.json(
      { error: "Failed to get session", details: error },
      { status: 500 }
    );
  }
}
