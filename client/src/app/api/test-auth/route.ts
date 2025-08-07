import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        return NextResponse.json({
            success: true,
            data: {
                hasSession: !!session,
                hasUser: !!session?.user,
                userEmail: session?.user?.email,
                hasAccessToken: !!session?.accessToken,
                tokenLength: session?.accessToken?.length,
                expiresAt: session?.expiresAt,
                tokenPreview: session?.accessToken ?
                    `${session.accessToken.substring(0, 10)}...` : null,
            }
        });
    } catch (error) {
        console.error("Auth test error:", error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}