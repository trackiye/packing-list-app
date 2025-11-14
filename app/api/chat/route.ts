import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60;

function getCacheKey(message: string, context?: any): string {
  return JSON.stringify({ message, context });
}

function getFromCache(key: string) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() });
  if (cache.size > 100) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
}

function buildAdvancedPrompt(message: string, context?: any) {
  return `You are PackMind AI, the world's most knowledgeable travel packing expert with 20+ years of experience.

CONTEXT:
Trip: ${context?.trip || message}
Accommodation: ${context?.accommodation || "Not specified"}
Season: ${context?.season || "Not specified"}

MISSION: Create hyper-personalized packing lists that prove you understand THIS specific trip.

ANALYSIS FRAMEWORK:
1. DESTINATION: Climate, culture, infrastructure, common issues
2. WEATHER: Exact temps, rain type, humidity, UV index
3. ACCOMMODATION: Hotel amenities vs camping needs
4. ACTIVITIES: Specific gear for hiking, beach, business, etc.
5. DURATION: Weekend capsule vs 2-week trip
6. SMART ITEMS: Versatile, preventive, culturally appropriate

OUTPUT JSON:
{
  "tripSummary": "2-3 sentences showing you GET this trip",
  "categories": {
    "Essentials": [{"name": "Item", "note": "Trip-specific reason", "packed": false}],
    "Clothing": [...],
    "Toiletries": [...],
    "Electronics": [...],
    "Activities": [...],
    "Documents": [...],
    "Optional": [...]
  }
}

QUALITY: Every item needs a trip-specific note. No generic advice.
Example: "Reef-safe SPF 50+ - Hawaii has strict coral laws, tropical sun is intense year-round"`;
}

export async function POST(req: NextRequest) {
  try {
    const { message, context } = await req.json();

    const cacheKey = getCacheKey(message, context);
    const cached = getFromCache(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          'X-Cache': 'HIT',
        },
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: buildAdvancedPrompt(message, context) },
        { role: "user", content: `Create a detailed packing list for: ${message}` },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 3000,
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}");
    setCache(cacheKey, result);

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'X-Cache': 'MISS',
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to generate packing list" },
      { status: 500 }
    );
  }
}
