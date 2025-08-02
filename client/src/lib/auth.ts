import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: [
                        "openid",
                        "email",
                        "profile",
                        "https://www.googleapis.com/auth/calendar",
                        "https://www.googleapis.com/auth/calendar.events",
                    ].join(" "),
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),
    ],
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