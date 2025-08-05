import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Backend API configuration
export const BACKEND_URL = "http://localhost:8000";

export const authOptions: NextAuthOptions = {
  providers: [],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token and refresh_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like the access_token from a provider
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.expiresAt = token.expiresAt;
      return session;
    },
    async signIn({ account, profile }) {
      // Add debugging for OAuth issues
      console.log("SignIn callback:", { account, profile });
      return true;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error", // Add error page
  },
  session: {
    strategy: "jwt",
  },
  // Add this for development - allows unverified apps
  debug: process.env.NODE_ENV === "development",
  // Add error handling
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log("SignIn event:", { user, account, profile, isNewUser });
    },
    async signOut({ session, token }) {
      console.log("SignOut event:", { session, token });
    },
  },
  // Add error handling for client fetch errors
  logger: {
    error(code, ...message) {
      console.error(`[NextAuth][error][${code}]`, ...message);
    },
    warn(code, ...message) {
      console.warn(`[NextAuth][warn][${code}]`, ...message);
    },
    debug(code, ...message) {
      if (process.env.NODE_ENV === "development") {
        console.log(`[NextAuth][debug][${code}]`, ...message);
      }
    },
  },
};

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  }
}
