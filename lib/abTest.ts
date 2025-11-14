// lib/abTest.ts - A/B Testing Framework Core Logic (FINAL)
import { trackABTestVariant } from "@/components/Analytics";

/**
 * Assigns a user to an A/B test variant (A or B) and persists the choice in localStorage.
 * Also triggers an analytics event to record the variant view.
 * @param testName - The name of the test (e.g., "signup_modal_copy").
 * @returns The assigned variant ("A" or "B").
 */
export function getABVariant(testName: string): "A" | "B" {
  // Ensure this runs only on the client where localStorage is available
  if (typeof window === "undefined") {
    return "A"; // Default for server-side rendering
  }

  const key = `ab_test_${testName}`;
  let variant = localStorage.getItem(key) as "A" | "B" | null;

  if (!variant) {
    // Randomly assign A (50%) or B (50%)
    variant = Math.random() < 0.5 ? "A" : "B";
    localStorage.setItem(key, variant);
  }

  // Record the variant assignment in analytics (CRITICAL STEP)
  trackABTestVariant(testName, variant);

  return variant;
}
