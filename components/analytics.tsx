"use client";

import { useEffect } from 'react';

// Extend the Window interface to include gtag with proper typing (accepts array of unknown arguments)
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer: unknown[]; // Use unknown[] to avoid 'any'
  }
}

// Function to load the GA script and configure tracking
// Using rest parameters (...args) instead of 'arguments' for compliance
function initGA() {
  // Check if we are running in the browser
  if (typeof document === 'undefined') return;

  // NOTE: This ID must match the one in app/page.tsx for event tracking to work
  const measurementId = 'G-1YLHGXN1LG'; 
  
  // Load Google Analytics script
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.async = true;
  document.head.appendChild(script);

  // Define the global function gtag and initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  
  // Define gtag function using rest parameters
  function gtag(...args: unknown[]): void {
    window.dataLayer.push(args);
  }
  
  // Initialize GA config
  gtag('js', new Date());
  gtag('config', measurementId);
}

export default function Analytics() {
  useEffect(() => {
    // Run the initialization logic only once when the component mounts
    initGA();
  }, []);

  return null; // This component is for background tracking only
}