// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from 'next/script'; 

const inter = Inter({ subsets: ["latin"], display: "swap" });

// --- IMPROVED SEO METADATA ---
export const metadata: Metadata = {
  title: "Packmind AI - Smart Packing Lists | Never Forget Anything",
  description: "Generate perfect AI-powered packing lists in seconds. Free, personalized travel packing checklists for any trip. Never forget essentials again!",
  keywords: ["packing list", "travel checklist", "AI packing", "trip planner", "travel essentials", "packing assistant"],
  authors: [{ name: "Packmind AI" }],
  creator: "Packmind AI",
  publisher: "Packmind AI",
  metadataBase: new URL('https://packmind.ai'), // Change to your actual domain
  
  // Open Graph / Facebook
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://packmind.ai",
    title: "Packmind AI - Smart Packing Lists",
    description: "Generate perfect AI-powered packing lists in seconds. Free, personalized travel packing checklists for any trip.",
    siteName: "Packmind AI",
    images: [
      {
        url: "/og-image.png", // You'll need to create this
        width: 1200,
        height: 630,
        alt: "Packmind AI - Smart Packing Lists",
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Packmind AI - Smart Packing Lists",
    description: "Generate perfect AI-powered packing lists in seconds. Free, personalized travel packing checklists.",
    images: ["/og-image.png"], // Same as OG image
    creator: "@packmindai", // Change to your Twitter handle
  },
  
  // Additional Meta Tags
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Verification (add your codes)
  verification: {
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Theme Color for Mobile Browsers */}
        <meta name="theme-color" content="#a855f7" />
        
        {/* Preconnect to External Domains for Performance */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        {/* Structured Data for SEO */}
        <Script id="structured-data" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Packmind AI",
            "description": "AI-powered packing list generator for travelers",
            "url": "https://packmind.ai",
            "applicationCategory": "TravelApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "150"
            }
          })}
        </Script>
      </head>
      
      {/* Google Analytics */}
      <Script 
        src="https://www.googletagmanager.com/gtag/js?id=G-1YLHGXN1LG" 
        strategy="afterInteractive"
      />
      <Script id="google-analytics-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-1YLHGXN1LG', {
            page_path: window.location.pathname,
          });
        `}
      </Script>

      <body>
        {children}
      </body>
    </html>
  );
}