"use client";

import { useState } from "react";
import { useFirebaseAuth } from "../lib/firebase-auth";

export default function GoogleMeetTestingGuide() {
  const { user, loading } = useFirebaseAuth();
  const [testStep, setTestStep] = useState(1);

  const steps = [
    {
      title: "1. Check OAuth Testing Mode Status",
      content: (
        <div className="space-y-3">
          <div className="bg-blue-50 p-4 rounded border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">
              Current Status:
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>✅ Google Client ID: Configured</li>
              <li>✅ Calendar Scopes: Included</li>
              <li>✅ Development Mode: Active</li>
              <li>
                {user ? "✅" : "❌"} Firebase Auth:{" "}
                {user ? "Active" : "Not signed in"}
              </li>
            </ul>
          </div>

          {!user && (
            <button
              onClick={() => (window.location.href = "/role-selection")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Go to Sign In
            </button>
          )}

          {user && (
            <div className="space-y-2">
              <p className="text-green-600">✅ Signed in as: {user.email}</p>
              <button
                onClick={() => {
                  /* Firebase logout is handled globally */
                }}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "2. Understanding Testing Mode Limitations",
      content: (
        <div className="space-y-4">
          <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2">
              ⚠️ Testing Mode Restrictions:
            </h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>
                • Only you (developer) and added test users can use the app
              </li>
              <li>• Users will see "This app isn't verified" warning</li>
              <li>• 100 user limit for testing</li>
              <li>• All Google APIs work normally for test users</li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded border border-green-200">
            <h4 className="font-semibold text-green-800 mb-2">
              ✅ What Still Works:
            </h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Google Meet link generation</li>
              <li>• Calendar event creation</li>
              <li>• Email invitations</li>
              <li>• All Calendar API features</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "3. Quick Google Meet Test",
      content: (
        <div className="space-y-4">
          {user ? (
            <div>
              <p className="mb-3">
                Test Google Meet creation with your current session:
              </p>
              <a
                href="/test-google-meet"
                className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Go to Google Meet Test Page
              </a>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded border">
              <p className="text-gray-600">
                Please sign in first to test Google Meet functionality.
              </p>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "4. Adding Test Users (if needed)",
      content: (
        <div className="space-y-3">
          <div className="bg-blue-50 p-4 rounded border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">
              To Add More Test Users:
            </h4>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>
                Go to{" "}
                <a
                  href="https://console.cloud.google.com/"
                  target="_blank"
                  className="underline"
                >
                  Google Cloud Console
                </a>
              </li>
              <li>Navigate to "APIs & Services" → "OAuth consent screen"</li>
              <li>Scroll down to "Test users" section</li>
              <li>Click "ADD USERS" and enter email addresses</li>
              <li>Save changes</li>
            </ol>
          </div>

          <div className="bg-green-50 p-4 rounded border border-green-200">
            <h4 className="font-semibold text-green-800 mb-2">💡 Pro Tip:</h4>
            <p className="text-sm text-green-700">
              Test users will see the unverified app warning but can still
              proceed by clicking "Advanced" → "Go to [Your App] (unsafe)"
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "5. Troubleshooting Common Issues",
      content: (
        <div className="space-y-3">
          <div className="space-y-3">
            <div className="border-l-4 border-red-400 pl-4">
              <h5 className="font-semibold text-red-700">
                Issue: "This app isn't verified"
              </h5>
              <p className="text-sm text-red-600">
                Solution: Click "Advanced" → "Go to [App Name] (unsafe)"
              </p>
            </div>

            <div className="border-l-4 border-yellow-400 pl-4">
              <h5 className="font-semibold text-yellow-700">
                Issue: "Access blocked"
              </h5>
              <p className="text-sm text-yellow-600">
                Solution: Add user as test user in Google Cloud Console
              </p>
            </div>

            <div className="border-l-4 border-blue-400 pl-4">
              <h5 className="font-semibold text-blue-700">
                Issue: "Calendar API not enabled"
              </h5>
              <p className="text-sm text-blue-600">
                Solution: Enable Google Calendar API in Cloud Console
              </p>
            </div>

            <div className="border-l-4 border-green-400 pl-4">
              <h5 className="font-semibold text-green-700">
                Issue: No Google Meet link in event
              </h5>
              <p className="text-sm text-green-600">
                Solution: Ensure conferenceDataVersion: 1 is set in API call
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">
          🧪 Google Meet in OAuth Testing Mode Guide
        </h1>

        {/* Step Navigation */}
        <div className="flex justify-center mb-6">
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setTestStep(index + 1)}
                className={`w-8 h-8 rounded-full text-sm font-semibold ${
                  testStep === index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Current Step */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {steps[testStep - 1].title}
          </h2>
          {steps[testStep - 1].content}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setTestStep(Math.max(1, testStep - 1))}
            disabled={testStep === 1}
            className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50 hover:bg-gray-600"
          >
            Previous
          </button>

          <button
            onClick={() => setTestStep(Math.min(steps.length, testStep + 1))}
            disabled={testStep === steps.length}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 hover:bg-blue-700"
          >
            Next
          </button>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="font-semibold mb-3">Quick Actions:</h3>
          <div className="flex flex-wrap gap-2">
            <a
              href="/test-google-meet"
              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
            >
              Test Google Meet
            </a>
            <a
              href="https://console.cloud.google.com/apis/credentials"
              target="_blank"
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Google Cloud Console
            </a>
            <a
              href="https://console.cloud.google.com/apis/api/calendar-json.googleapis.com"
              target="_blank"
              className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
            >
              Calendar API Status
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
