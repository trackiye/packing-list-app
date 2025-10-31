// app/api/chat/route.ts - FULLY STABILIZED AND OPTIMIZED (TypeScript Compliant)
import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export const runtime = "edge";

interface PackingItem {
  item_name: string;
  description: string;
  category: string;
}

// Interface for the payload being passed to the API route
interface ApiPayload {
  message: string;
  conversationHistory: string;
  packingItems: PackingItem[] | null;
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory, packingItems }: ApiPayload = await request.json();

    // 1. Check for API key (Required for AI SDK)
    if (!process.env.OPENAI_API_KEY) {
      console.error("❌ OPENAI_API_KEY not found in environment variables");
      return NextResponse.json(
        {
          error: "AI service not configured. Missing API Key.",
          message:
            "I'm having trouble connecting right now. Please make sure the API key is set up!",
          suggestions: ["Try again later", "Contact support"],
        },
        { status: 500 }
      );
    }

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // 2. Build system prompt - Optimized for Speed, Decisiveness & Conversion
    const systemPrompt = `You are the **PackMind Elite Packing Strategist**, a highly efficient and concise AI assistant. Your sole purpose is to gather crucial trip details FAST and generate the perfect packing list.

TONE & EFFICIENCY RULES:
1.  **Speed is Paramount (Conversion Focus):** Your responses must be brief (max 2 sentences) and direct. Use natural, warm language, but prioritize gathering information over being overly conversational. **The conversation must conclude within 3 turns, maximum.**
2.  **Decisiveness:** You require four pieces of information: **Destination (Where), Duration (How Long), Activities (What to do), and Weather/Season.**
    * **CRITICAL RULE 1: IF any piece of information is missing, ask for it using a single, clear question.**
    * **CRITICAL RULE 2: IF three or four pieces of information have been provided, IMMEDIATELY GENERATE THE LIST.** Do not ask any more questions.
3.  **Suggestions:** Your suggested replies must be highly relevant, specific examples that guide the user to the missing answer (e.g., if Duration is missing, suggest '5 days', '2 weeks').

CONVERSION OUTPUT (STRICT JSON RULE):
-   **List Generation Phase:** When Critical Rule 2 is met, you **MUST ONLY** return a single JSON object. Do not include any conversational text, greetings, or explanations outside of the JSON block.

PACKING LIST FORMAT (when ready to generate):
Return **ONLY** a single JSON object with the "packingList" array:
{
  "packingList": [
    {
      "item_name": "Specific Item Name (e.g., Noise-Canceling Headphones)",
      "description": "A brief, compelling reason why this item is essential for *their specific trip* (e.g., 'For restful long-haul flights and focus during travel.')",
      "category": "Category Name"
    }
  ]
}

CATEGORIES TO USE (Use these EXACTLY):
- Documents & Essentials
- Clothing & Footwear  
- Toiletries & Personal Care
- Electronics & Gadgets
- Health & Safety
- Entertainment & Comfort
- Miscellaneous

CURRENT CONTEXT (Analyze for Missing Data):
${
  conversationHistory ||
  "Starting new conversation. Missing all four data points."
}
${
  packingItems
    ? `User already has ${packingItems.length} items in their list. Last message is a request to MODIFY the existing list (e.g., make it minimal, add beach gear). Acknowledge the current list and suggest adjustments.`
    : "No list generated yet."
}

User's New Message: ${message}`;

    // 3. Call OpenAI API using AI SDK
    const { text: aiResponse } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: systemPrompt,
      temperature: 0.7,
      maxTokens: 2048,
    });

    // 4. Extract packing list from response
    let packingList: PackingItem[] = [];
    let cleanMessage = aiResponse;

    // Look for JSON in response (GPT models often embed the JSON)
    const jsonMatch = aiResponse.match(
      /\{[\s\S]*?"packingList"[\s\S]*?\[[\s\S]*?\][\s\S]*?\}/
    );

    // CRITICAL RESILIENCE FIX: If a match is found, attempt safe parsing.
    if (jsonMatch) {
      try {
        const jsonString = jsonMatch[0];
        const parsed = JSON.parse(jsonString);

        if (parsed.packingList && Array.isArray(parsed.packingList)) {
          // Asserting type for the list items
          packingList = parsed.packingList as PackingItem[]; 
          // Remove JSON from message, only keeping any conversational intro/outro text
          cleanMessage = aiResponse.replace(jsonString, "").trim();
        }
      } catch (e: unknown) { // FIX: Use unknown for catch argument
        console.error(
          "❌ JSON Extraction Error: AI provided malformed JSON or surrounding text.", e
        );
        // If parsing fails, we treat the entire response as a clean conversational message.
        packingList = [];
        cleanMessage = aiResponse;
      }
    }

    // 5. Generate contextual suggestions
    const suggestions = generateSuggestions(
      message,
      cleanMessage,
      packingList,
      packingItems
    );

    // 6. Return response
    if (packingList.length > 0) {
      return NextResponse.json({
        message:
          cleanMessage ||
          "✨ I've crafted your personalized list! Let me know if you want any elite adjustments before you save it.",
        packingList,
        suggestions,
      });
    }

    return NextResponse.json({
      message: cleanMessage,
      packingList: null,
      suggestions,
    });
  } catch (error: unknown) { // FIX: Use unknown for catch argument
    // LOG DETAILED ERROR on the server for debugging
    const errorMessage = (error as Error).message || "Unknown error occurred.";
    console.error("❌ Chat API Fatal Error:", errorMessage, error);

    // Return a generic, safe 500 response to the client
    return NextResponse.json(
      {
        error:
          "Failed to process message due to a server error (AI service communication issue).",
        message:
          "I'm having trouble connecting to the AI. Could you try again or restart the chat?",
        suggestions: ["Try again", "Start over"],
      },
      { status: 500 }
    );
  }
}

// ===============================================
// generateSuggestions function (FIXED FOR TYPES)
// ===============================================
function generateSuggestions(
  userMessage: string,
  aiResponse: string,
  packingList: PackingItem[] | null,
  existingItems: PackingItem[] | null // FIX: Use PackingItem[] instead of any[]
): string[] {
  const msg = userMessage.toLowerCase();
  const res = aiResponse.toLowerCase();

  // 1. After list is generated (Highest Priority Suggestions)
  if (packingList && packingList.length > 0) {
    return [
      "Make it a carry-on only list",
      "Add more business attire",
      "Perfect! Download it",
      "Email me the list",
    ];
  }

  // 2. Identify missing key data points based on AI's response (Mid-Conversation)
  if (res.includes("where are you headed") || res.includes("destination")) {
    return [
      "Paris (City break)",
      "Tropical beach resort",
      "Remote hiking trail",
    ];
  }

  if (res.includes("how long") || res.includes("duration")) {
    // FIX: Provide concrete duration options
    return ["3 days", "1 week", "2 weeks", "3 months"];
  }

  if (res.includes("activities") || res.includes("what will you be doing")) {
    // FIX: Provide concrete activity options
    return [
      "Business meetings & dinners",
      "Sightseeing & museums",
      "Hiking & camping",
      "Lounging & swimming",
    ];
  }

  if (
    res.includes("weather") ||
    res.includes("season") ||
    res.includes("temperature")
  ) {
    // FIX: Provide concrete weather/season options
    return [
      "Warm & sunny (Summer)",
      "Cold & snowy (Winter)",
      "Mild, rainy (Spring)",
      "Unpredictable weather",
    ];
  }

  // 3. Fallback for general conversation or modification suggestions
  if (existingItems && existingItems.length > 0) {
    if (msg.includes("more") || msg.includes("add")) {
      return [
        "Add camera gear",
        "Include comfort items",
        "More cold weather clothing",
      ];
    }
    if (msg.includes("less") || msg.includes("minimal")) {
      return ["Keep only essentials", "Remove duplicates", "Carry-on only"];
    }
  }

  // 4. Default initial suggestions
  return [
    "Weekend beach trip",
    "Business travel",
    "Family vacation",
    "Adventure travel",
  ];
}