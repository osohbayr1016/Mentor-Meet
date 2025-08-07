"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function TestStudentAuth() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            Student Google Auth Test
          </h1>

          {session ? (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-green-800 mb-4">
                  ✅ Authenticated Successfully!
                </h2>

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium">Email:</span>{" "}
                    {session.user?.email}
                  </div>
                  <div>
                    <span className="font-medium">Name:</span>{" "}
                    {session.user?.name}
                  </div>
                  <div>
                    <span className="font-medium">Access Token:</span>
                    <span className="text-green-600 ml-2">
                      {session.accessToken ? "✅ Available" : "❌ Missing"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Token Length:</span>
                    <span className="ml-2">
                      {session.accessToken?.length || 0} characters
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Expires At:</span>
                    <span className="ml-2">
                      {session.expiresAt
                        ? new Date(session.expiresAt * 1000).toLocaleString()
                        : "Unknown"}
                    </span>
                  </div>
                </div>

                {session.user?.image && (
                  <div className="mt-4">
                    <img
                      src={session.user.image}
                      alt="Profile"
                      className="w-16 h-16 rounded-full mx-auto"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => signOut()}
                  className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Sign Out
                </button>

                <Link href="/student-dashboard">
                  <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    Go to Dashboard
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-yellow-800 mb-4">
                  Not Authenticated
                </h2>
                <p className="text-yellow-700">
                  Please sign in to test the Google authentication.
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                <Link href="/student-login">
                  <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    Student Login
                  </button>
                </Link>

                <Link href="/student-signup">
                  <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors">
                    Student Signup
                  </button>
                </Link>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4">
              Testing Instructions:
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
              <li>Click "Student Login" or "Student Signup" above</li>
              <li>
                Click the "Google-р нэвтрэх" or "Google-р бүртгүүлэх" button
              </li>
              <li>Complete the Google OAuth flow</li>
              <li>You should be redirected back here or to the dashboard</li>
              <li>Check that the access token is available for Calendar API</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
