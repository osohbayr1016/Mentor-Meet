"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="backdrop-blur-2xl border-t border-white/10 bg-black/20">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <div className="flex justify-center space-x-6">
              <Link
                href="/"
                className={`px-6 py-2 transition-colors rounded-xl backdrop-blur-sm border text-sm ${
                  pathname === "/"
                    ? "bg-white/20 text-white border-white/50"
                    : "text-white/70 hover:text-white border-white/20 hover:border-white/40"
                }`}
              >
                Нүүр хуудас
              </Link>
              <Link
                href="/signup"
                className={`px-6 py-2 transition-colors rounded-xl backdrop-blur-sm border text-sm ${
                  pathname.startsWith("/signup")
                    ? "bg-white/20 text-white border-white/50"
                    : "text-white/70 hover:text-white border-white/20 hover:border-white/40"
                }`}
              >
                Менторууд
              </Link>
              <Link
                href="/create-profile"
                className={`px-6 py-2 font-medium rounded-xl backdrop-blur-sm border text-sm ${
                  pathname.startsWith("/create-profile")
                    ? "bg-white/30 text-white border-white/60"
                    : "bg-white/20 text-white hover:bg-white/30 border-white/50 hover:border-white/70"
                }`}
              >
                Бүртгүүлэх
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Footer */}
      <div className="fixed bottom-2 left-6 text-xs text-white/60 z-40">
        <div>Copyright © 2025 Mentor Meet</div>
        <div>All rights reserved.</div>
      </div>
    </>
  );
}
