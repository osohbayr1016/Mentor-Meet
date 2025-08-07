"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function TestGoogleOAuthDebug() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    
    try {
      console.log("Starting Google OAuth test...");
      const result = await signIn("google", {
        redirect: false,
        callbackUrl: "/test-google-oauth-debug",
      });
      
      console.log("Google OAuth result:", result);
      
      if (result?.error) {
        setError(`OAuth Error: ${result.error}`);
      }
    } catch (err: any) {
      console.error("OAuth test error:", err);
      setError(`Test Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Google OAuth Debug Test</h1>
        
        <div className="space-y-4">
          <div>
            <strong>Status:</strong> {status}
          </div>
          
          {session ? (
            <div className="space-y-2">
              <div><strong>Email:</strong> {session.user?.email}</div>
              <div><strong>Name:</strong> {session.user?.name}</div>
              <div><strong>Image:</strong> {session.user?.image}</div>
              <div><strong>Access Token:</strong> {session.accessToken ? "Present" : "Missing"}</div>
              
              <button
                onClick={() => signOut()}
                className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? "Testing..." : "Test Google Sign In"}
              </button>
              
              <div className="text-sm text-gray-600">
                <p>Open browser console (F12) to see debug logs</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}