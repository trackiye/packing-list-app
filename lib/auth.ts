// lib/auth.ts
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google'; // Correct Import Path

// NOTE: Ensure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are in your .env.local

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async session({ session, token }) {
            // CRITICAL: Inject userId and isPro status into the session object for API consumption
            if (session.user) {
                // Mock a simple userId based on email (REQUIRED for list counting)
                session.user.id = token.sub || session.user.email; 
                
                // MOCK isPro check based on email containing 'pro'
                session.user.isPro = session.user.email?.includes('pro') || false;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                // Pass user data (like user.id) to the token
                token.id = user.id;
            }
            return token;
        },
    },
};
