"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFirebaseAuth } from "@/lib/firebase-auth";
import {
  convertFirebaseUser,
  storeFirebaseUser,
} from "@/lib/firebase-integration";
import { Google } from "lucide-react";

interface FirebaseAuthProps {
  onSuccess?: () => void;
  userType?: "student" | "mentor";
}

export const FirebaseLogin: React.FC<FirebaseAuthProps> = ({
  onSuccess,
  userType = "student",
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { signIn, signInWithGoogle } = useFirebaseAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await signIn(email, password);
      // Store user data in localStorage for compatibility with existing system
      if (user) {
        const userData = convertFirebaseUser(user, userType);
        storeFirebaseUser(userData);
      }
      onSuccess?.();
    } catch (error: any) {
      setError(error.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      const user = await signInWithGoogle();
      // Store user data in localStorage for compatibility with existing system
      if (user) {
        const userData = convertFirebaseUser(user, userType);
        storeFirebaseUser(userData);
      }
      onSuccess?.();
    } catch (error: any) {
      setError(error.message || "Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full"
          />
        </div>
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-4">
        <Button
          onClick={handleGoogleSignIn}
          disabled={loading}
          variant="outline"
          className="w-full flex items-center gap-2"
        >
          <Google className="w-4 h-4" />
          Sign in with Google
        </Button>
      </div>
    </div>
  );
};

export const FirebaseSignup: React.FC<FirebaseAuthProps> = ({
  onSuccess,
  userType = "student",
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { signUp, signInWithGoogle } = useFirebaseAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const user = await signUp(email, password);
      // Store user data in localStorage for compatibility with existing system
      if (user) {
        const userData = convertFirebaseUser(user, userType);
        storeFirebaseUser(userData);
      }
      onSuccess?.();
    } catch (error: any) {
      setError(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      const user = await signInWithGoogle();
      // Store user data in localStorage for compatibility with existing system
      if (user) {
        const userData = convertFirebaseUser(user, userType);
        storeFirebaseUser(userData);
      }
      onSuccess?.();
    } catch (error: any) {
      setError(error.message || "Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full"
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full"
          />
        </div>
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <div className="mt-4">
        <Button
          onClick={handleGoogleSignIn}
          disabled={loading}
          variant="outline"
          className="w-full flex items-center gap-2"
        >
          <Google className="w-4 h-4" />
          Sign up with Google
        </Button>
      </div>
    </div>
  );
};
