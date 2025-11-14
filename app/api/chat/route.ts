import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "60 s"),
  analytics: true,
});

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;

    // Rate limiting
    const ip = req.headers.get("x-forwarded-for") || "anonymous";
    const { success } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again in a minute." },
        { status: 429 }
      );
    }

    // System prompt for packing list generation
    const systemPrompt = `You are PackMind AI, an expert travel packing assistant. Generate comprehensive, personalized packing lists based on user trip details.

Format your response as:
## Category Name
- Item 1
- Item 2

Categories to consider: Documents, Electronics, Clothing, Toiletries, Accessories, Outdoor Gear, Medical, etc.

Be specific, thorough, and adapt to trip duration, destination, activities, and season.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const message = response.choices[0]?.message?.content || "Error generating list";

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to generate packing list" },
      { status: 500 }
    );
  }
}
