import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // For now, skip authentication and allow admin access in development
    // TODO: Implement Firebase Admin SDK for proper server-side authentication

    const adminEmails = [
      // Add admin email addresses here
      "admin@mentormeet.com",
      "support@mentormeet.com",
      // Add more admin emails as needed
    ];

    // For development, allow any request
    // In production, implement proper authentication
    if (
      typeof process.env.NODE_ENV === "string" &&
      process.env.NODE_ENV !== "production"
    ) {
      return NextResponse.json({ authorized: true });
    }

    // TODO: Get user email from Firebase token
    const userEmail = "admin@mentormeet.com"; // Placeholder

    // Check if user is in admin list
    const isAdmin = adminEmails.includes(userEmail || "");

    // Or check backend for admin role
    try {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${API_BASE_URL}/admin/check-role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.isAdmin) {
          return NextResponse.json({ authorized: true });
        }
      }
    } catch (backendError) {
      console.warn("Backend admin check unavailable:", backendError);
    }

    // For development, allow any authenticated user
    // In production, remove this and implement proper role checking
    if (
      typeof process.env.NODE_ENV === "string" &&
      process.env.NODE_ENV !== "production"
    ) {
      return NextResponse.json({ authorized: true });
    }

    if (isAdmin) {
      return NextResponse.json({ authorized: true });
    } else {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error("Error checking admin permissions:", error);
    return NextResponse.json(
      { error: "Permission check failed" },
      { status: 500 }
    );
  }
}
