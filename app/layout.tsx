// app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import NextAuthSessionProvider from '@/components/providers/session-provider'; // Import provider

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'PackMindAI - The AI Packing Co-Pilot',
  description: 'Never forget an item again. AI-powered packing lists.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Wrap the entire application with the SessionProvider */}
        <NextAuthSessionProvider>
          {children}
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
