"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function TestAuth() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Authentication Test</h1>
        <p className="mb-4">You are not signed in.</p>
        <button
          onClick={() => signIn("google")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Authentication Test</h1>
      <div className="mb-4">
        <p>
          <strong>Status:</strong> {status}
        </p>
        <p>
          <strong>User:</strong> {session?.user?.email}
        </p>
        <p>
          <strong>Access Token:</strong>{" "}
          {session?.accessToken ? "EXISTS" : "MISSING"}
        </p>
        <p>
          <strong>Refresh Token:</strong>{" "}
          {session?.refreshToken ? "EXISTS" : "MISSING"}
        </p>
        <p>
          <strong>Expires At:</strong> {session?.expiresAt}
        </p>
      </div>

      <button
        onClick={() => signOut()}
        className="bg-red-500 text-white px-4 py-2 rounded mr-2"
      >
        Sign Out
      </button>

      <button
        onClick={async () => {
          const response = await fetch("/api/debug-session");
          const data = await response.json();
          console.log("Debug session:", data);
          alert(JSON.stringify(data, null, 2));
        }}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Test API Session
      </button>
    </div>
  );
}
