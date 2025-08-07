import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function requireAdminAuth() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/auth/signin?callbackUrl=/admin");
    }

    // Check if user has admin role
    // For now, we'll check if email is in admin list or has admin role
    const adminEmails = [
        "admin@mentormeet.com",
        "support@mentormeet.com",
        // Add your admin emails here
    ];

    const isAdmin = adminEmails.includes(session.user?.email || "");

    // In production, you should check the user's role from database
    // const user = await getUserByEmail(session.user.email);
    // if (user?.role !== "admin") { redirect("/"); }

    if (!isAdmin && process.env.NODE_ENV === "production") {
        redirect("/");
    }

    return session;
}

export async function checkAdminPermission(req?: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return { authorized: false, session: null };
    }

    // Check admin permissions
    const adminEmails = [
        "admin@mentormeet.com",
        "support@mentormeet.com"
    ];

    const isAdmin = adminEmails.includes(session.user?.email || "");

    // For development, allow any authenticated user
    if (process.env.NODE_ENV === "development") {
        return { authorized: true, session };
    }

    return { authorized: isAdmin, session };
}

// Helper function to get admin user info
export async function getAdminUser() {
    const session = await getServerSession(authOptions);

    if (!session) return null;

    return {
        name: session.user?.name || "Admin",
        email: session.user?.email || "",
        image: session.user?.image || "",
    };
}