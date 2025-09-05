import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function requireAdminAuth() {
  // TODO: Implement Firebase Admin SDK authentication
  // For now, allow admin access in development
  if (process.env.NODE_ENV !== "development") {
    // In production, implement proper Firebase authentication
    // redirect("/role-selection?callbackUrl=/admin");
  }

  // Check if user has admin role
  // For now, we'll check if email is in admin list or has admin role
  const adminEmails = [
    "admin@mentormeet.com",
    "support@mentormeet.com",
    // Add your admin emails here
  ];

  // TODO: Implement Firebase user email check
  const isAdmin = adminEmails.includes("admin@mentormeet.com"); // Placeholder for development

  // In production, you should check the user's role from database
  // const user = await getUserByFirebaseUid(firebaseUser.uid);
  // if (user?.role !== "admin") { redirect("/"); }

  if (
    !isAdmin &&
    typeof process.env.NODE_ENV === "string" &&
    process.env.NODE_ENV !== "production"
  ) {
    redirect("/");
  }

  // TODO: Return Firebase user instead of session
  return { user: { email: "admin@mentormeet.com" } };
}

export async function checkAdminPermission(req?: NextRequest) {
  // TODO: Implement Firebase authentication check
  // For now, allow in development
  const adminEmails = ["admin@mentormeet.com", "support@mentormeet.com"];

  // For development, allow any request
  if (
    typeof process.env.NODE_ENV === "string" &&
    process.env.NODE_ENV !== "production"
  ) {
    return {
      authorized: true,
      session: { user: { email: "admin@mentormeet.com" } },
    };
  }

  return { authorized: false, session: null };
}

// Helper function to get admin user info
export async function getAdminUser() {
  // TODO: Implement Firebase user retrieval
  // For now, return placeholder admin user
  return {
    name: "Admin",
    email: "admin@mentormeet.com",
    image: "",
  };
}
