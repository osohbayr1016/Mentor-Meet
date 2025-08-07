import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        // TODO: Implement proper admin role checking
        // For now, check if user email is in admin list or has admin role

        const adminEmails = [
            // Add admin email addresses here
            "admin@mentormeet.com",
            "support@mentormeet.com",
            // Add more admin emails as needed
        ];

        const userEmail = session.user?.email;

        // Check if user is in admin list
        const isAdmin = adminEmails.includes(userEmail || "");

        // Or check backend for admin role
        try {
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
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
        if (process.env.NODE_ENV === "development") {
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