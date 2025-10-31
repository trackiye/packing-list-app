// app/api/generate/route.ts - CLEAN PLACEHOLDER FOR BUILD STABILITY

import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  // This route is a legacy placeholder to prevent build errors
  // in case the build script is still referencing it.

  try {
    // FIX: Destructure the message body but don't assign it to an unused variable
    await request.json();

    // Placeholder AI Call to ensure all dependencies are resolved during compilation
    const { text } = await generateText({
      model: openai("gpt-3.5-turbo"),
      prompt:
        "Respond with a simple, fixed message: 'This API route has been deprecated. Please use /api/chat instead.'",
      temperature: 0,
    });

    return NextResponse.json(
      {
        message: text,
        error: "Deprecated API route. Use /api/chat.",
      },
      { status: 410 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";

    console.error("Legacy /generate API Error:", errorMessage, error);

    return NextResponse.json(
      { error: "Legacy API endpoint failure.", details: errorMessage },
      { status: 500 }
    );
  }
}
