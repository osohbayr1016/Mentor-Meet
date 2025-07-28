"use client";

import BottomNavigation from "@/components/BottomNavigation";

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative">
      {children}
      <BottomNavigation />
    </div>
  );
}
