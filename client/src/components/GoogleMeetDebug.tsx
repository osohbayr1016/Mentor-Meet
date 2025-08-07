"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

interface DebugInfo {
  hasSession: boolean;
  hasAccessToken: boolean;
  tokenLength?: number;
  userEmail?: string;
  expiresAt?: number;
  scopes?: string[];
}

interface TestResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export default function GoogleMeetDebug() {
  const { data: session } = useSession();
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [testResults, setTestResults] = useState<Record<string, TestResult>>(
    {}
  );
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const updateDebugInfo = () => {
    setDebugInfo({
      hasSession: !!session,
      hasAccessToken: !!(session as any)?.accessToken,
      tokenLength: (session as any)?.accessToken?.length,
      userEmail: session?.user?.email,
      expiresAt: (session as any)?.expiresAt,
    });
  };

  const runTest = async (testName: string, endpoint: string, body?: any) => {
    setLoading((prev) => ({ ...prev, [testName]: true }));

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body || {}),
      });

      const result = await response.json();

      setTestResults((prev) => ({
        ...prev,
        [testName]: {
          success: response.ok && result.success !== false,
          message: result.message || `Status: ${response.status}`,
          data: result.data,
          error: result.error,
        },
      }));
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        [testName]: {
          success: false,
          message: "Network error",
          error: error instanceof Error ? error.message : "Unknown error",
        },
      }));
    } finally {
      setLoading((prev) => ({ ...prev, [testName]: false }));
    }
  };

  const testBasicMeet = () => {
    runTest("basicMeet", "/api/test-google-meet", {
      menteeEmail: "test@example.com",
      title: "Debug Test Meeting",
      duration: 30,
    });
  };

  const testBookingConfirmation = () => {
    runTest("bookingConfirm", "/api/confirm-booking-with-meeting", {
      bookingId: "test-booking-123",
      mentorEmail: session?.user?.email || "mentor@test.com",
      studentEmail: "student@test.com",
      sessionDate: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
      duration: 60,
      subject: "Debug Test Session",
    });
  };

  const testPaymentGeneration = () => {
    runTest("paymentGeneration", "/api/generate-meeting-after-payment", {
      bookingId: "test-payment-booking-456",
      mentorEmail: session?.user?.email || "mentor@test.com",
      studentEmail: "student@test.com",
      date: new Date().toISOString().split("T")[0],
      time: "14:00",
      duration: 90,
      title: "Debug Payment Test Session",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">
          Google Meet Integration Debug
        </h1>

        {/* Session Debug */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Session Information</h2>
            <button
              onClick={updateDebugInfo}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              Refresh
            </button>
          </div>

          {debugInfo ? (
            <div className="bg-gray-50 p-4 rounded space-y-2 text-sm">
              <div
                className={`flex items-center ${
                  debugInfo.hasSession ? "text-green-600" : "text-red-600"
                }`}
              >
                <span className="w-4 h-4 mr-2">
                  {debugInfo.hasSession ? "✅" : "❌"}
                </span>
                Session: {debugInfo.hasSession ? "Active" : "Not found"}
              </div>
              <div
                className={`flex items-center ${
                  debugInfo.hasAccessToken ? "text-green-600" : "text-red-600"
                }`}
              >
                <span className="w-4 h-4 mr-2">
                  {debugInfo.hasAccessToken ? "✅" : "❌"}
                </span>
                Access Token:{" "}
                {debugInfo.hasAccessToken
                  ? `Present (${debugInfo.tokenLength} chars)`
                  : "Missing"}
              </div>
              <div>
                <strong>User Email:</strong>{" "}
                {debugInfo.userEmail || "Not available"}
              </div>
              <div>
                <strong>Token Expires:</strong>{" "}
                {debugInfo.expiresAt
                  ? new Date(debugInfo.expiresAt * 1000).toLocaleString()
                  : "Not available"}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Click refresh to load session info</p>
          )}
        </div>

        {/* Test Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={testBasicMeet}
            disabled={loading.basicMeet}
            className="p-4 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading.basicMeet ? "Testing..." : "Test Basic Google Meet"}
          </button>

          <button
            onClick={testBookingConfirmation}
            disabled={loading.bookingConfirm}
            className="p-4 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading.bookingConfirm
              ? "Testing..."
              : "Test Booking Confirmation"}
          </button>

          <button
            onClick={testPaymentGeneration}
            disabled={loading.paymentGeneration}
            className="p-4 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
          >
            {loading.paymentGeneration
              ? "Testing..."
              : "Test Payment Generation"}
          </button>
        </div>

        {/* Test Results */}
        <div className="space-y-4">
          {Object.entries(testResults).map(([testName, result]) => (
            <div
              key={testName}
              className={`p-4 rounded border ${
                result.success
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold capitalize">
                  {testName.replace(/([A-Z])/g, " $1")}
                </h3>
                <span
                  className={`text-sm ${
                    result.success ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {result.success ? "✅ Success" : "❌ Failed"}
                </span>
              </div>
              <p className="text-sm mb-2">{result.message}</p>

              {result.data && (
                <div className="text-xs bg-white p-2 rounded border">
                  <strong>Data:</strong>
                  <pre className="mt-1 overflow-x-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              )}

              {result.error && (
                <div className="text-xs bg-red-100 p-2 rounded border border-red-200">
                  <strong>Error:</strong> {result.error}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h3 className="font-semibold mb-2">Debug Instructions:</h3>
          <ol className="text-sm space-y-1 list-decimal list-inside">
            <li>
              Make sure you're signed in with Google (check session info above)
            </li>
            <li>Test basic Google Meet creation first</li>
            <li>
              If basic test fails, check Google Cloud Console API settings
            </li>
            <li>
              Test booking confirmation to verify integration with booking
              system
            </li>
            <li>Check browser console for detailed error logs</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
