// --- OpenAI Imports (Active) ---
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai'; // Using generateText (non-streaming)
import { NextResponse } from 'next/server';

// --- Google Imports (Commented Out) ---
/*
import { google } from '@ai-sdk/google';
import { streamText } from 'ai'; // Or generateText if using non-streaming Google
import { NextResponse } from 'next/server';
*/

export const maxDuration = 30;

export async function POST(req: Request) {
  console.log("\n--- API Route Called (Using OpenAI) ---");

  // --- Check for OpenAI Key (Active) ---
  console.log("OpenAI Key Loaded Check:", process.env.OPENAI_API_KEY ? `sk-...${process.env.OPENAI_API_KEY.slice(-4)}` : "MISSING!");
  if (!process.env.OPENAI_API_KEY) {
      console.error("CRITICAL: OPENAI_API_KEY missing!");
      return NextResponse.json({ error: 'Internal Server Error: OpenAI API key missing.' }, { status: 500 });
  }
  // --- END Check ---

  // --- Check for Google Key (Commented Out) ---
  /*
  console.log("Google Key Loaded Check:", process.env.GOOGLE_GENERATIVE_AI_API_KEY ? `...${process.env.GOOGLE_GENERATIVE_AI_API_KEY.slice(-4)}` : "MISSING!");
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error("CRITICAL: GOOGLE_GENERATIVE_AI_API_KEY missing!");
      return NextResponse.json({ error: 'Internal Server Error: Google API key missing.' }, { status: 500 });
  }
  */

  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  }

  try {
    const { prompt } = await req.json();
    console.log("Received prompt:", prompt);

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Bad Request: Missing prompt' }, { status: 400 });
    }

    // --- Master Prompt (Same for both, keep active) ---
    const masterPrompt = `
      You are 'Nomad,' an expert travel packer. A user is asking for a packing list based on their trip details: "${prompt}"

      Generate a list of essential items (around 9-15 items). For each item, provide a concise name, a brief description (1 sentence max), and a general category (like Clothing, Toiletries, Electronics, Documents, Footwear, Miscellaneous).

      IMPORTANT: Respond ONLY with a valid JSON array of objects. Each object must have the keys "item_name", "description", and "category". Do not include any introductory text, markdown formatting, code block syntax (\`\`\`json), or explanations outside of the JSON array structure itself. Ensure the entire response is a single, valid JSON array starting with '[' and ending with ']'.

      Example Response Format:
      [
        { "item_name": "Passport", "description": "Ensure valid 6+ months.", "category": "Documents" },
        { "item_name": "Walking Shoes", "description": "Lots of walking.", "category": "Footwear" },
        { "item_name": "Travel Adapter", "description": "For charging.", "category": "Electronics" }
      ]
    `;
    // --- END Master Prompt ---

    // --- OpenAI Call (Active, Non-Streaming) ---
    console.log("Calling OpenAI generateText with gpt-3.5-turbo...");
    const { text } = await generateText({
      model: openai('gpt-3.5-turbo'), // Using OpenAI model
      prompt: masterPrompt,
    });
    console.log("generateText call finished.");
    console.log("Received text (should be JSON):", text ? text.substring(0, 100)+"..." : "EMPTY");
    // --- END OpenAI Call ---

    // --- Google Call (Commented Out) ---
    /*
    console.log("Calling Google Gemini streamText/generateText...");
    const result = await streamText({ // Or generateText if preferred
      model: google('models/gemini-1.5-flash-latest'), // Example Google model
      prompt: masterPrompt,
    });
    console.log("streamText/generateText call finished.");
    */
    // --- END Google Call ---

    // --- OpenAI Response Handling (Active) ---
    if (text) {
      console.log("Returning full text response.");
      return new Response(text, {
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      });
    } else {
      console.error("Error: generateText returned empty text.");
      return NextResponse.json({ error: 'Internal Server Error: AI returned empty response' }, { status: 500 });
    }
    // --- END OpenAI Response Handling ---

    // --- Google Response Handling (Commented Out) ---
    /*
    // If using streamText:
    if (result && result.textStream) {
      console.log("Returning textStream (should contain JSON).");
      return new Response(result.textStream, {
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
      });
    }
    // If using generateText (would need const { text } = await generateText(...) above):
    // if (text) {
    //   console.log("Returning full text response.");
    //   return new Response(text, { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
    // }
    else {
      console.error("Error: Failed to get stream/text from Google.");
      return NextResponse.json({ error: 'Internal Server Error: Failed to get response from Google' }, { status: 500 });
    }
    */
    // --- END Google Response Handling ---

  } catch (error: unknown) {
    console.error("!!! Critical Error in API route:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
     if (error instanceof Error) { console.error("Error Details:", error.cause || error.stack || error); }
     else { console.error("Error Details:", error); }
    return NextResponse.json({ error: `Internal Server Error: ${errorMessage}` }, { status: 500 });
  }
}