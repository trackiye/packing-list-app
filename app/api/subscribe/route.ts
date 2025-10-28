// app/api/generate/route.ts
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';

export const maxDuration = 30;

// --- Rate Limiting Map (Simple in-memory solution) ---
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per window
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(identifier);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
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
    // --- API Key Validation ---
    if (!process.env.OPENAI_API_KEY) {
      console.error("CRITICAL: OPENAI_API_KEY missing!");
      return NextResponse.json(
        { error: 'Service temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    // --- Method Check ---
    if (req.method !== 'POST') {
      return NextResponse.json(
        { error: 'Method Not Allowed' },
        { status: 405, headers: { 'Allow': 'POST' } }
      );
    }

    // --- Rate Limiting ---
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // --- Input Validation ---
    const body = await req.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request. Please provide a trip description.' },
        { status: 400 }
      );
    }

    if (prompt.length > 500) {
      return NextResponse.json(
        { error: 'Trip description too long. Please keep it under 500 characters.' },
        { status: 400 }
      );
    }

    if (prompt.trim().length < 5) {
      return NextResponse.json(
        { error: 'Trip description too short. Please provide more details.' },
        { status: 400 }
      );
    }

    // --- Build Enhanced Prompt ---
    const masterPrompt = `
You are 'Nomad,' an expert travel packing assistant. A user is planning a trip and needs a packing list.

Trip Details: "${prompt}"

Generate a comprehensive packing list with 9-15 essential items tailored to this specific trip. Consider:
- Trip duration and destination
- Weather and season
- Activities mentioned
- Travel style (business, leisure, adventure, etc.)

For each item, provide:
1. "item_name": A clear, specific item name (e.g., "Waterproof Hiking Boots" not just "Shoes")
2. "description": A brief, helpful reason why this item is essential (1 sentence, under 100 characters)
3. "category": One of these categories: Clothing, Toiletries, Electronics, Documents, Footwear, Accessories, Health & Safety, or Miscellaneous

CRITICAL FORMATTING RULES:
- Respond ONLY with a valid JSON array
- No markdown, no code blocks, no explanations
- Start with '[' and end with ']'
- Ensure all JSON is properly escaped
- Each object must have exactly these three keys: "item_name", "description", "category"

Example Response Format:
[
  { "item_name": "Passport", "description": "Required for international travel, ensure 6+ months validity.", "category": "Documents" },
  { "item_name": "Comfortable Walking Shoes", "description": "Essential for sightseeing with lots of walking.", "category": "Footwear" },
  { "item_name": "Universal Travel Adapter", "description": "Charge devices in any country.", "category": "Electronics" }
]
    `.trim();

    // --- Call OpenAI ---
    const { text } = await generateText({
      model: openai('gpt-3.5-turbo'),
      prompt: masterPrompt,
      temperature: 0.7,
      // Removed maxTokens - not supported in this version of the AI SDK
    });

    // --- Validate Response ---
    if (!text || text.trim().length === 0) {
      console.error("OpenAI returned empty response");
      return NextResponse.json(
        { error: 'Failed to generate packing list. Please try again.' },
        { status: 500 }
      );
    }

    // --- Attempt to Parse and Validate JSON ---
    try {
      const parsed = JSON.parse(text);
      
      if (!Array.isArray(parsed)) {
        throw new Error("Response is not an array");
      }

      // Validate each item has required fields
      const isValid = parsed.every(item => 
        item.item_name && 
        item.description && 
        item.category &&
        typeof item.item_name === 'string' &&
        typeof item.description === 'string' &&
        typeof item.category === 'string'
      );

      if (!isValid) {
        throw new Error("Invalid item structure");
      }

      // Return validated response
      return new Response(text, {
        headers: { 
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-store, max-age=0',
        },
      });

    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Received text:", text.substring(0, 200));
      
      return NextResponse.json(
        { error: 'AI returned invalid format. Please try again.' },
        { status: 500 }
      );
    }

  } catch (error: unknown) {
    console.error("Critical Error in API route:", error);
    
    // Handle specific OpenAI errors
    if (error instanceof Error) {
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Service is busy. Please try again in a moment.' },
          { status: 429 }
        );
      }
      
      if (error.message.includes('timeout')) {
        return NextResponse.json(
          { error: 'Request timed out. Please try again.' },
          { status: 504 }
        );
      }
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

// --- Optional: Add GET endpoint for health checks ---
export async function GET() {
  return NextResponse.json(
    { 
      status: 'ok', 
      service: 'Packmind AI Generation API',
      timestamp: new Date().toISOString()
    },
    { status: 200 }
  );
}