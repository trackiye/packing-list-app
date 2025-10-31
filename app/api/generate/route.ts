// app/api/generate/route.ts
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextResponse } from "next/server";

export const maxDuration = 30;

// --- Rate Limiting Map (Retained for best practice) ---
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000;

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(identifier);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT) {
    return false;
  }

  userLimit.count++;
  return true;
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Service temporarily unavailable. Missing API Key." },
        { status: 503 }
      );
    }

    if (req.method !== "POST") {
      return NextResponse.json(
        { error: "Method Not Allowed" },
        { status: 405, headers: { Allow: "POST" } }
      );
    }

    // --- Rate Limiting ---
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // --- CRITICAL CHANGE: Expect Clean, Rich Context Payload ---
    const body = await req.json();
    const { tripSummary, packingProfile } = body;

    if (!tripSummary || !packingProfile) {
      return NextResponse.json(
        {
          error:
            "Invalid request. Missing full trip context (tripSummary/packingProfile).",
        },
        { status: 400 }
      );
    }

    // --- MONETIZATION FIX: List of names the AI MUST use for monetization ---
    const monetizationNames = [
      "Universal Travel Adapter",
      "Noise Canceling Headphones",
      "40L Carry-On Backpack",
      "Compression Packing Cubes",
      "Merino Wool T-Shirt",
      "RFID Blocking Passport Wallet",
      "TSA Approved Toiletry Bag",
    ];

    const masterPrompt = `
You are 'Nomad,' an expert travel packing assistant. Your primary goal is to provide a highly personalized list for the user based on the full context below.

USER TRIP SUMMARY: "${tripSummary}"
USER PACKING PROFILE (Context Gathered by Conversation): "${packingProfile}"

**CRITICAL INSTRUCTIONS FOR PERSONALIZATION AND MONETIZATION:**
1. **Prioritize Relevance:** Personalize the list based on the Accommodation, Activities, and Baggage Profile.
2. **Monetization Priority:** For items that match high-value categories, **you MUST use the exact item_name** from this list: ${monetizationNames.join(
      ", "
    )}. Do not alter these names.
3. **Deduction:** If the profile suggests the item isn't needed (e.g., "Hotel" or "Relatives/Friends" means no basic toiletries), omit it.
4. **List Length:** Generate 9-15 essential items.

For each item, provide:
1. "item_name": Use the prioritized monetization names when relevant, otherwise use a very specific, unique name.
2. "description": A brief, helpful reason (1 sentence, under 100 characters).
3. "category": One of these categories: Clothing, Toiletries, Electronics, Documents, Footwear, Accessories, Health & Safety, Beach & Water, Religious Items, or Miscellaneous.

CRITICAL FORMATTING RULES:
- Respond ONLY with a valid JSON array.
- No markdown, no code blocks, no explanations, no preamble.
- Start with '[' and end with ']'
- Each object must have exactly these three keys: "item_name", "description", "category"
    `.trim();

    // --- Call OpenAI ---
    const { text } = await generateText({
      model: openai("gpt-3.5-turbo"),
      prompt: masterPrompt,
      temperature: 0.7,
    });

    // --- Validate and Return Response (Retained from original for reliability) ---
    if (!text || text.trim().length === 0) {
      console.error("OpenAI returned empty response");
      return NextResponse.json(
        { error: "Failed to generate packing list. Please try again." },
        { status: 500 }
      );
    }

    try {
      const parsed = JSON.parse(text);
      if (
        !Array.isArray(parsed) ||
        !parsed.every(
          (item) => item.item_name && item.description && item.category
        )
      ) {
        throw new Error("Invalid item structure");
      }

      return new Response(text, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store, max-age=0",
        },
      });
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      return NextResponse.json(
        { error: "AI returned invalid format. Please try again." },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Critical Error in API route:", error);
    if (error.message && error.message.includes("rate limit")) {
      return NextResponse.json(
        { error: "Service is busy. Try again later." },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { status: "ok", service: "Packmind AI Generation API" },
    { status: 200 }
  );
}
