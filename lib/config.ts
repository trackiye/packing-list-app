// lib/config.ts
// Multi-tenant configuration foundation for 40+ AI assistant sites

export type QuestionType =
  | "text"
  | "date-range"
  | "single-select"
  | "multi-select"
  | "number";

export interface QuestionOption {
  value: string;
  label: string;
  icon?: string;
}

export interface ConversationQuestion {
  id: string;
  type: QuestionType;
  question: string;
  placeholder?: string;
  options?: QuestionOption[];
  required: boolean;
  helpText?: string;
}

export interface SiteConfig {
  domain: string;
  brandName: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  affiliateTag: string;
  pricingTier: "free" | "premium" | "pro";
  conversationFlow: ConversationQuestion[];
  features: {
    aiPowered: boolean;
    affiliateProducts: boolean;
    pdfExport: boolean;
    emailDelivery: boolean;
  };
}

// Default configuration for Packmind AI
export const SITE_CONFIG: SiteConfig = {
  domain: "packmind.ai",
  brandName: "Packmind AI",
  tagline: "Your AI-Powered Packing List Generator",
  primaryColor: "#3B82F6", // blue-500
  secondaryColor: "#10B981", // green-500
  affiliateTag: "packmind-20",
  pricingTier: "premium",

  conversationFlow: [
    {
      id: "trip-details",
      type: "text",
      question: "Where and when are you traveling?",
      placeholder: "e.g., 5 days in Miami, Florida in December",
      required: true,
      helpText: "Include your destination and travel dates",
    },
    {
      id: "accommodation",
      type: "single-select",
      question: "What type of accommodation will you have?",
      required: true,
      options: [
        { value: "hotel", label: "Hotel", icon: "🏨" },
        { value: "airbnb", label: "Airbnb/Vacation Rental", icon: "🏠" },
        { value: "hostel", label: "Hostel", icon: "🛏️" },
        { value: "camping", label: "Camping", icon: "⛺" },
        { value: "family", label: "Family/Friends", icon: "👨‍👩‍👧‍👦" },
      ],
    },
    {
      id: "activities",
      type: "multi-select",
      question: "What activities are you planning?",
      required: true,
      helpText: "Select all that apply",
      options: [
        { value: "beach", label: "Beach/Swimming", icon: "🏖️" },
        { value: "hiking", label: "Hiking/Outdoors", icon: "🥾" },
        { value: "business", label: "Business/Work", icon: "💼" },
        { value: "formal", label: "Formal Events", icon: "👔" },
        { value: "shabbat", label: "Shabbat/Religious", icon: "🕯️" },
        { value: "sports", label: "Sports/Fitness", icon: "⚽" },
        { value: "sightseeing", label: "Sightseeing", icon: "📸" },
        { value: "nightlife", label: "Nightlife", icon: "🎉" },
      ],
    },
    {
      id: "baggage",
      type: "single-select",
      question: "What baggage are you bringing?",
      required: true,
      options: [
        { value: "carry-on", label: "Carry-on Only", icon: "🎒" },
        { value: "checked", label: "Checked Bag", icon: "🧳" },
        { value: "backpack", label: "Backpack Only", icon: "🎒" },
        { value: "multiple", label: "Multiple Bags", icon: "🧳🧳" },
      ],
    },
    {
      id: "special-needs",
      type: "text",
      question: "Any special considerations or medical needs?",
      placeholder: "e.g., medications, dietary restrictions, etc.",
      required: false,
      helpText: "Optional - helps us personalize your list",
    },
  ],

  features: {
    aiPowered: true,
    affiliateProducts: true,
    pdfExport: true,
    emailDelivery: true,
  },
};

// Helper function to get site config by domain (for future multi-tenant support)
export function getSiteConfig(_domain?: string): SiteConfig {
  // FIX: ensures '_domain' is ignored
  // For now, return default Packmind config
  // Future: Look up config based on domain
  return SITE_CONFIG;
}

// Helper to build conversation context for API
export function buildConversationContext(
  answers: Record<string, unknown>
): string {
  // FIX: Use Record<string, unknown> for type safety
  const parts: string[] = [];

  if (answers["trip-details"]) {
    parts.push(`Trip: ${answers["trip-details"]}`);
  }

  if (answers["accommodation"]) {
    parts.push(`Accommodation: ${answers["accommodation"]}`);
  }

  // FIX: Check for array type safely
  if (
    answers["activities"] &&
    Array.isArray(answers["activities"]) &&
    answers["activities"].length > 0
  ) {
    parts.push(`Activities: ${answers["activities"].join(", ")}`);
  }

  if (answers["baggage"]) {
    parts.push(`Baggage: ${answers["baggage"]}`);
  }

  if (answers["special-needs"]) {
    parts.push(`Special needs: ${answers["special-needs"]}`);
  }

  return parts.join(" | ");
}
