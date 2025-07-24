"use client";

import BottomNavigation from "@/components/BottomNavigation";

export default function CreateProfileLayout({
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
