"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

export default function TestGoogleOAuth() {
  const { data: session, status } = useSession();
  const [testResult, setTestResult] = useState<string>("");

  const handleSignIn = async () => {
    try {
      const result = await signIn("google", {
        redirect: false,
        callbackUrl: window.location.origin,
      });
      
      console.log("Sign-in result:", result);
      setTestResult(`Sign-in result: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      console.error("Sign-in error:", error);
      setTestResult(`Error: ${error}`);
    }
  };

  const testStudentLogin = async () => {
    if (!session) {
      setTestResult("No session available");
      return;
    }

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${API_BASE_URL}/studentLogin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session.user?.email,
          googleAuth: true,
        }),
      });

      const data = await response.json();
      setTestResult(`Backend response: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setTestResult(`Backend error: ${error}`);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Google OAuth Test</h1>
      
      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold mb-2">Session Status: {status}</h2>
          {session ? (
            <div>
              <p><strong>Email:</strong> {session.user?.email}</p>
              <p><strong>Name:</strong> {session.user?.name}</p>
              <p><strong>Image:</strong> {session.user?.image}</p>
              <p><strong>Access Token:</strong> {session.accessToken ? "Available" : "Not available"}</p>
              <p><strong>Expires At:</strong> {session.expiresAt || "Unknown"}</p>
            </div>
          ) : (
            <p>No session</p>
          )}
        </div>

        <div className="space-x-4">
          {!session ? (
            <button
              onClick={handleSignIn}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Sign In with Google
            </button>
          ) : (
            <>
              <button
                onClick={() => signOut()}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Sign Out
              </button>
              <button
                onClick={testStudentLogin}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Test Student Login
              </button>
            </>
          )}
        </div>

        {testResult && (
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-bold mb-2">Test Result:</h3>
            <pre className="whitespace-pre-wrap text-sm">{testResult}</pre>
          </div>
        )}
      </div>
    </div>
  );
}