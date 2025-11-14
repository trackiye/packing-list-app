// lib/config.ts
// Multi-tenant configuration foundation for 40+ AI assistant sites

// Using original types for compatibility
export type QuestionType =
  | "text"
  | "date-range"
  | "single-select"
  | "multi-select"
  | "number"
  | "file-or-text"
  | "boolean"; // Added types based on blueprint needs

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

// 1. Core Config (Original Packmind AI configuration)
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

// Default configuration for Packmind AI (Used as fallback/default)
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

// 2. New Multi-Tenant Config Structure (Matching Blueprint)

export interface PricingTier {
  premium: number;
  premiumPro: number;
}

export interface NewSiteConfig {
  domain: string;
  niche: "travel" | "life-transition" | "design" | "event";
  brandName: string;
  primaryColor: string;
  affiliateTag: string;
  conversationFlow: ConversationQuestion[];
  premiumFeatures: string[];
  pricing: PricingTier;
}

// Simplified definition of the new portfolio sites from the blueprint (Page 10)
const SITES: Record<string, NewSiteConfig> = {
  // 1. Current Site: PackMind AI
  "packmind.ai": {
    domain: "packmind.ai",
    niche: "travel",
    brandName: "PackMind AI",
    primaryColor: "#667eea", // Blueprint color
    affiliateTag: "packmindai-20",
    conversationFlow: [
      // Using existing structure from original lib/config.ts for now
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
        question: "What type of accommodation?",
        required: true,
        options: [
          { value: "hotel", label: "Hotel", icon: "🏨" },
          { value: "airbnb", label: "Airbnb/Vacation Rental", icon: "🏠" },
          { value: "camping", label: "Camping", icon: "⛺" },
        ],
      },
    ] as ConversationQuestion[], // Casting to match new interface structure
    premiumFeatures: [
      "unlimited-saves",
      "pdf-export",
      "trip-journal",
      "shared-lists",
    ],
    pricing: { premium: 7, premiumPro: 25 },
  },

  // 2. Priority Launch Site: NewDadAI.com
  "newdadai.com": {
    domain: "newdadai.com",
    niche: "life-transition",
    brandName: "NewDad AI",
    primaryColor: "#3b82f6",
    affiliateTag: "newdadai-20",
    conversationFlow: [
      {
        id: "baby-age",
        type: "select",
        question: "How old is your baby?",
        required: true,
        options: [
          { value: "expecting", label: "Expecting" },
          { value: "newborn", label: "Newborn (0-3mo)" },
          { value: "3-6mo", label: "3-6mo" },
        ],
      },
      {
        id: "feeding",
        type: "select",
        question: "Feeding method?",
        required: true,
        options: [
          { value: "breast", label: "Breastfeeding" },
          { value: "formula", label: "Formula" },
        ],
      },
    ] as unknown as ConversationQuestion[],
    premiumFeatures: [
      "daily-tips",
      "emergency-support",
      "milestone-tracking",
      "partner-collab",
    ],
    pricing: { premium: 15, premiumPro: 40 },
  },

  // 3. Priority Launch Site: ApartmentDesignAI.com
  "apartmentdesignai.com": {
    domain: "apartmentdesignai.com",
    niche: "design",
    brandName: "Apartment Design AI",
    primaryColor: "#106981",
    affiliateTag: "aptdesignai-20",
    conversationFlow: [
      {
        id: "floor-plan",
        type: "file-or-text",
        question: "Upload floor plan or describe dimensions",
        required: true,
      },
      {
        id: "budget",
        type: "select",
        question: "Budget range?",
        required: true,
        options: [
          { value: "ikea", label: "Under $1K (IKEA)" },
          { value: "mix", label: "$1-3K (Mix)" },
        ],
      },
    ] as unknown as ConversationQuestion[],
    premiumFeatures: [
      "unlimited-designs",
      "ar-preview",
      "shopping-lists",
      "design-revisions",
    ],
    pricing: { premium: 12, premiumPro: 30 },
  },
};

// New function to dynamically load config based on the domain.
export function getNewSiteConfig(domain: string): NewSiteConfig | null {
  const normalizedDomain = domain.toLowerCase().replace(/^www\./, "");
  return SITES[normalizedDomain] || null;
}

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
