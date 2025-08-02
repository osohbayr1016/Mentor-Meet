"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import MeetingManager from "../../components/MeetingManager";

export default function MeetingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading
    if (!session) {
      router.push("/auth/signin");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg">Redirecting to sign in...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen">
      {/* Background image */}
      <div className="absolute inset-0 bg-black/30 -z-10" />
      <Image
        src="https://images.unsplash.com/photo-1706074740295-d7a79c079562?q=80&w=2232&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="background image"
        fill
        className="absolute inset-0 -z-20 object-cover"
        priority
      />

      {/* Main Content */}
      <div className="relative z-10 w-full min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6">
          <Link
            href="/mentor-calendar"
            className="text-white hover:text-gray-300"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <div className="flex items-center gap-3">
            <Image
              src="/image709.png"
              alt="Mentor Meet Logo"
              width={29}
              height={24}
            />
            <h1 className="text-2xl font-bold text-white">Mentor Meet</h1>
          </div>
          <div className="w-6" /> {/* Spacer for centering */}
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Миний Google Meet Уулзалтууд
          </h2>
          <p className="text-white/80">
            Таны төлөвлөгдсөн болон өнгөрсөн уулзалтуудыг харах, удирдах
          </p>
        </div>

        {/* Main Content Container */}
        <div className="flex-1 flex justify-center items-start px-6 pb-6">
          <div className="w-full max-w-4xl">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
              <MeetingManager className="bg-transparent shadow-none" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center p-6">
          <div className="flex justify-center gap-4">
            <Link
              href="/mentor-calendar"
              className="px-6 py-3 bg-white/10 text-white border border-white/30 rounded-xl hover:bg-white/20 transition-colors"
            >
              Хуваарь руу буцах
            </Link>
            <Link
              href="/mentor-dashboard"
              className="px-6 py-3 bg-white text-black rounded-xl hover:bg-gray-100 transition-colors"
            >
              Dashboard руу
            </Link>
          </div>
        </div>
      </div>

      {/* Copyright Footer */}
      <div className="fixed bottom-2 left-6 text-xs text-white/60 z-30">
        <div>Copyright © 2025 Mentor Meet</div>
        <div>All rights reserved.</div>
      </div>
    </div>
  );
}
