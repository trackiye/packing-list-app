"use client";

import { useEffect } from 'react';

// Extend the Window interface to include gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Helper function to load GA script and initialize tracking
function initGA() {
  // Load Google Analytics script
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=G-1YLHGXN1LG`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    // @ts-ignore
    window.dataLayer.push(arguments);
  }
  // @ts-ignore
  gtag('js', new Date());
  // @ts-ignore
  gtag('config', 'G-1YLHGXN1LG');
}

export default function Analytics() {
  useEffect(() => {
    // Run this function only once after the component mounts
    initGA();
  }, []);

  return null; // This component doesn't render any visible UI
}
