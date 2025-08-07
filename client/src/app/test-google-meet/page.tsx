"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";

interface TestMeetingResponse {
  success: boolean;
  message: string;
  data?: {
    meetingLink: string;
    eventId: string;
    startTime: string;
    endTime: string;
    calendarLink: string;
  };
  error?: string;
}

export default function TestGoogleMeet() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TestMeetingResponse | null>(null);
  const [formData, setFormData] = useState({
    menteeEmail: "test.student@example.com",
    title: "Test Mentorship Session",
    description: "This is a test Google Meet session for development/testing purposes",
    duration: 60
  });

  const handleCreateTestMeeting = async () => {
    if (!session) {
      signIn("google");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const response = await fetch("/api/test-google-meet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data: TestMeetingResponse = await response.json();
      setResult(data);

    } catch (error) {
      console.error("Error creating test meeting:", error);
      setResult({
        success: false,
        message: "Network error occurred",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Google Meet Integration Test
          </h1>

          {!session ? (
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
              <p className="text-gray-600 mb-6">
                You need to sign in with Google to test the Google Meet integration.
              </p>
              <button
                onClick={() => signIn("google")}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign in with Google
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800">✅ Authenticated</h3>
                <p className="text-green-700">
                  Signed in as: {session.user?.email}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Test Meeting Configuration</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student Email
                  </label>
                  <input
                    type="email"
                    value={formData.menteeEmail}
                    onChange={(e) => setFormData({...formData, menteeEmail: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter student email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meeting Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                    min="15"
                    max="180"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                onClick={handleCreateTestMeeting}
                disabled={loading}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {loading ? "Creating Test Meeting..." : "Create Test Google Meet"}
              </button>

              {result && (
                <div className={`rounded-lg p-6 ${
                  result.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                }`}>
                  <h3 className={`font-semibold mb-3 ${
                    result.success ? "text-green-800" : "text-red-800"
                  }`}>
                    {result.success ? "✅ Success!" : "❌ Error"}
                  </h3>
                  
                  <p className={`mb-4 ${
                    result.success ? "text-green-700" : "text-red-700"
                  }`}>
                    {result.message}
                  </p>

                  {result.success && result.data && (
                    <div className="space-y-3">
                      <div>
                        <strong>Google Meet Link:</strong>
                        <div className="flex items-center gap-2 mt-1">
                          <a
                            href={result.data.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline break-all"
                          >
                            {result.data.meetingLink}
                          </a>
                          <button
                            onClick={() => copyToClipboard(result.data!.meetingLink)}
                            className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-xs"
                          >
                            Copy
                          </button>
                        </div>
                      </div>

                      <div>
                        <strong>Calendar Event:</strong>
                        <div className="mt-1">
                          <a
                            href={result.data.calendarLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View in Google Calendar
                          </a>
                        </div>
                      </div>

                      <div>
                        <strong>Meeting Time:</strong>
                        <p className="text-sm text-gray-600">
                          {new Date(result.data.startTime).toLocaleString()} - {new Date(result.data.endTime).toLocaleString()}
                        </p>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded p-3">
                        <p className="text-blue-800 text-sm">
                          <strong>Note:</strong> The meeting is scheduled for 30 minutes from now. 
                          Check your Google Calendar for the event and invite.
                        </p>
                      </div>
                    </div>
                  )}

                  {!result.success && result.error && (
                    <div className="mt-3">
                      <strong>Error Details:</strong>
                      <pre className="bg-gray-100 p-2 rounded text-xs mt-1 overflow-x-auto">
                        {result.error}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">Testing Instructions:</h4>
                <ol className="list-decimal list-inside text-yellow-700 space-y-1 text-sm">
                  <li>Make sure you're signed in with a Google account that has Calendar access</li>
                  <li>Click "Create Test Google Meet" to generate a test meeting</li>
                  <li>Check your Google Calendar for the created event</li>
                  <li>Test the Google Meet link by clicking on it</li>
                  <li>Verify that email invitations are sent (if using real emails)</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}