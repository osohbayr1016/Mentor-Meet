"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface SessionProviderProps {
  children: ReactNode;
}

export default function SessionProvider({ children }: SessionProviderProps) {
  return (
    <NextAuthSessionProvider
      // Add error handling for client fetch errors
      refetchInterval={0} // Disable automatic refetching to prevent errors
      refetchOnWindowFocus={false} // Disable refetch on window focus
    >
      {children}
    </NextAuthSessionProvider>
  );
}
