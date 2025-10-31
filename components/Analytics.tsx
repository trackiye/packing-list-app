"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Your Google Analytics ID: G-1YLHGXN1LG
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "G-1YLHGXN1LG";

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    // Load Google Analytics script
    const script1 = document.createElement("script");
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script1);

    const script2 = document.createElement("script");
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}', {
        page_path: window.location.pathname,
      });
    `;
    document.head.appendChild(script2);
  }, [GA_MEASUREMENT_ID]);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || !window.gtag) return;

    const url = pathname + searchParams.toString();
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }, [pathname, searchParams, GA_MEASUREMENT_ID]);

  return null;
}

// Helper functions to track events
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, eventParams);
  }
};

export const trackListGeneration = (tripContext: string, itemCount: number) => {
  trackEvent("generate_packing_list", {
    trip_context: tripContext,
    item_count: itemCount,
  });
};

export const trackAffiliateClick = (
  productName: string,
  productUrl: string
) => {
  trackEvent("affiliate_click", {
    product_name: productName,
    product_url: productUrl,
  });
};

export const trackEmailCapture = (email: string) => {
  trackEvent("email_capture", {
    email_domain: email.split("@")[1],
  });
};

export const trackPDFDownload = (itemCount: number) => {
  trackEvent("pdf_download", {
    item_count: itemCount,
  });
};

export const trackShareClick = (platform: string) => {
  trackEvent("share_click", {
    platform: platform,
  });
};
