import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Backend API configuration
export const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events",
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile, user }) {
      // Persist the OAuth access_token and refresh_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like the access_token from a provider
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.expiresAt = token.expiresAt;
      session.provider = token.provider;
      return session;
    },
    async signIn({ account, profile, user }) {
      // Enhanced debugging for OAuth issues
      console.log("SignIn callback:", {
        account: account ? { provider: account.provider, type: account.type } : null,
        profile: profile ? { email: profile.email, name: profile.name } : null,
        user: user ? { email: user.email, name: user.name } : null
      });

      // Allow all Google sign-ins
      if (account?.provider === "google") {
        return true;
      }

      return true;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development",
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log("SignIn event:", {
        userEmail: user?.email,
        provider: account?.provider,
        isNewUser
      });
    },
    async signOut({ session, token }) {
      console.log("SignOut event:", { sessionEmail: session?.user?.email });
    },
  },
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
    provider?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    provider?: string;
  }
}
