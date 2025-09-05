import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./_components/MentorUserProvider";
import { FirebaseAuthProvider } from "../lib/firebase-auth";
import ErrorBoundary from "../components/ErrorBoundary";
import { HomeChat } from "./_components/Chat";

import BottomNavigation from "../components/BottomNavigation";
import Copyright from "../components/Copyright";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mentor Meet",
  description: "A platform for mentors and students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <FirebaseAuthProvider>
          <AuthProvider>
            <HomeChat />
            {children}
            <BottomNavigation />
          </AuthProvider>
        </FirebaseAuthProvider>
      </body>
    </html>
  );
}
