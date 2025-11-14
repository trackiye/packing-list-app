"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
  }
}

function AnalyticsContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "G-1YLHGXN1LG";

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

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
        anonymize_ip: true,
      });
    `;
    document.head.appendChild(script2);
  }, [GA_MEASUREMENT_ID]);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || !window.gtag) return;
    const url = pathname + searchParams.toString();
    window.gtag("config", GA_MEASUREMENT_ID, { page_path: url });
  }, [pathname, searchParams, GA_MEASUREMENT_ID]);

  return null;
}

export function Analytics() {
  return (
    <Suspense fallback={null}>
      <AnalyticsContent />
    </Suspense>
  );
}

// Base tracking
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, unknown>
) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, eventParams);
  }
};

// Core events
export const trackListGeneration = (tripContext: string, itemCount: number) => {
  trackEvent("generate_packing_list", {
    trip_context_length: tripContext.length,
    item_count: itemCount,
  });
};

export const trackAffiliateClick = (productName: string, productUrl: string) => {
  trackEvent("affiliate_click", {
    product_name: productName.substring(0, 100),
    product_domain: new URL(productUrl).hostname,
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

// Conversion tracking
export const trackRateLimitHit = (
  userType: "anonymous" | "signed_in",
  listsCreated: number
) => {
  trackEvent("rate_limit_hit", {
    user_type: userType,
    lists_created: listsCreated,
  });
};

export const trackSignupModalView = (
  trigger: "soft" | "hard" | "banner",
  listsCreated: number
) => {
  trackEvent("signup_modal_view", {
    trigger_type: trigger,
    lists_created: listsCreated,
  });
};

export const trackProModalView = (listsCreated: number, timeSaved: number) => {
  trackEvent("pro_modal_view", {
    lists_created: listsCreated,
    time_saved_minutes: timeSaved,
  });
};

export const trackConversionModalDismiss = (
  modalType: "signup" | "pro",
  trigger: string
) => {
  trackEvent("conversion_modal_dismiss", {
    modal_type: modalType,
    trigger: trigger,
  });
};

export const trackPDFPaywallHit = (userType: "free" | "signed_in") => {
  trackEvent("pdf_paywall_hit", {
    user_type: userType,
  });
};

export const trackFeatureUsage = (
  feature: "email" | "share" | "pdf" | "modify",
  listsCreated: number
) => {
  trackEvent("feature_usage", {
    feature_name: feature,
    lists_created: listsCreated,
  });
};

export const trackFunnelStep = (
  step: string,
  stepNumber: number,
  metadata?: Record<string, unknown>
) => {
  trackEvent("funnel_step", {
    step_name: step,
    step_number: stepNumber,
    ...metadata,
  });
};

export const trackExitIntent = (hasUnsavedChanges: boolean) => {
  trackEvent("exit_intent", {
    has_unsaved_changes: hasUnsavedChanges,
  });
};

export const trackABTestVariant = (testName: string, variant: string) => {
  trackEvent("ab_test_view", {
    test_name: testName,
    variant: variant,
  });
};
