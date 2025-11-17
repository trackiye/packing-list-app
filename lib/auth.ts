// lib/auth.ts
import { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter'; // Assuming you use Prisma for DB

// NOTE: You must have GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, 
// and NEXTAUTH_SECRET set in your .env.local file.

export const authOptions: AuthOptions = {
  // adapter: PrismaAdapter(prisma), // Uncomment if you are using Prisma
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    // Add more providers here if needed
  ],
  // Secret should be a random string.
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token, user }) {
      // Add user ID to the session object for use in API routes
      if (session.user) {
        session.user.id = user?.id || token.sub; // token.sub is the user ID if no database adapter is used
      }
      return session;
    },
  },
};
