// lib/utils.ts
// Shared utilities for styling and data handling
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility function for conditional Tailwind class merging (shadcn/ui standard)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility function to get the current conversion justification text (Phase 4.2)
export function getConversionJustification(
  listsCreated: number,
  timeSaved: number
): string {
  if (listsCreated >= 10 && timeSaved >= 60) {
    return "You're a master traveler, having saved over an hour and created 10+ lists. Unlock **Priority AI** to keep scaling your efficiency.";
  }
  if (listsCreated >= 5) {
    return "You've created 5+ lists and are officially a power user. Unlock **Unlimited Saves and PDF Export** to secure your history.";
  }
  return "Upgrade to Pro for priority features designed for frequent travelers, including PDF export and faster AI.";
}
