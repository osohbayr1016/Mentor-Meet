"use client";
import React, { useState } from "react";
import { FirebaseLogin, FirebaseSignup } from "@/components/FirebaseAuth";
import { useFirebaseAuth } from "@/lib/firebase-auth";
import { Button } from "@/components/ui/button";

export default function FirebaseAuthDemo() {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<"student" | "mentor">("student");
  const { user, logout, loading } = useFirebaseAuth();

  const handleSuccess = () => {
    console.log("Authentication successful!");
    // You can redirect or perform other actions here
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-center mb-6">Welcome!</h1>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Email:</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">User Type:</p>
              <p className="font-medium capitalize">{userType}</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-600">Firebase UID:</p>
              <p className="font-mono text-xs">{user.uid}</p>
            </div>
            <Button onClick={logout} className="w-full" variant="outline">
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">
            {isLogin ? "Sign In" : "Create Account"}
          </h1>
          <p className="text-gray-600">
            {isLogin ? "Welcome back!" : "Join Mentor Meet today!"}
          </p>
        </div>

        {/* User Type Selection */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-2">I am a:</p>
          <div className="flex space-x-4">
            <button
              onClick={() => setUserType("student")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                userType === "student"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Student
            </button>
            <button
              onClick={() => setUserType("mentor")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                userType === "mentor"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Mentor
            </button>
          </div>
        </div>

        {/* Auth Form */}
        {isLogin ? (
          <FirebaseLogin onSuccess={handleSuccess} userType={userType} />
        ) : (
          <FirebaseSignup onSuccess={handleSuccess} userType={userType} />
        )}

        {/* Toggle between Login/Signup */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 hover:text-blue-700 text-sm font-medium"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
