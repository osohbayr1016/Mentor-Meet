import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        return NextResponse.json({
            isAuthenticated: !!session,
            session: session ? {
                user: session.user,
                accessToken: session.accessToken ? "EXISTS" : "MISSING",
                refreshToken: session.refreshToken ? "EXISTS" : "MISSING",
                expiresAt: session.expiresAt,
            } : null,
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