// app/layout.tsx

import type { Metadata } from "next";
// --- 1. IMPORT THE FONT ---
import { Inter } from "next/font/google";
import "./globals.css";
import Analytics from '../components/analytics'; // Keep your analytics

// --- 2. CONFIGURE THE FONT ---
const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Packmind AI - Smart Packing Lists", // Updated title
  description: "Generate the perfect packing list for any trip with AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // --- 3. APPLY THE FONT CLASS TO THE HTML TAG ---
    <html lang="en" className={inter.className}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}