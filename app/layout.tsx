// app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import AuthProvider from '@/components/auth-provider'; // Corrected Import Path
import { Toaster } from '@/components/ui/toaster'; 
// NOTE: Assuming Analytics is available or we temporarily comment it out if it fails next
// import Analytics from '@/components/analytics'; 

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'PackMindAI - The AI Packing Co-Pilot',
  description: 'Pack Smarter. Travel Lighter. AI-powered packing lists for any trip.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          {children}
          <Toaster position="top-center" />
          {/* <Analytics />  */}
        </AuthProvider>
      </body>
    </html>
  );
}
