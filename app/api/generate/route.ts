// Import the Google provider
import { google } from '@ai-sdk/google';
// Keep streamText from 'ai' and NextResponse
import { streamText } from 'ai';
import { NextResponse } from 'next/server';

export const maxDuration = 30; // For Netlify functions

export async function POST(req: Request) {
  console.log("\n--- API Route Called (Google Gemini) ---");
  console.log("Google Key Loaded Check:", process.env.GOOGLE_GENERATIVE_AI_API_KEY ? `...${process.env.GOOGLE_GENERATIVE_AI_API_KEY.slice(-4)}` : "MISSING!");

  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  }
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error("CRITICAL: GOOGLE_GENERATIVE_AI_API_KEY missing!");
      return NextResponse.json({ error: 'Internal Server Error: API key missing.' }, { status: 500 });
  }

  try {
    const { prompt } = await req.json();
    console.log("Received prompt:", prompt);

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Bad Request: Missing prompt' }, { status: 400 });
    }

    const masterPrompt = `
      You are 'Nomad,' an expert travel packer. A user is asking for a packing list.
      Their prompt is: "${prompt}"

      Generate a perfect, comprehensive packing list.
      - Organize the list into logical categories (e.g., Clothing, Toiletries, Electronics, Documents).
      - Make the tone friendly, helpful, and exciting.
      - At the end, add one "Pro Tip" relevant to their trip.
      - Format the entire response in clean markdown.
    `;

    console.log("Calling Google Gemini streamText with gemini-pro-latest..."); // Updated log
    // --- CHANGE MODEL NAME ---
    const result = await streamText({
      // Try the 'gemini-pro-latest' model name
      // The SDK function adds 'models/' prefix automatically
      model: google('gemini-pro-latest'), // Use gemini-pro-latest
      prompt: masterPrompt,
    });
    // --- END CHANGE ---
    console.log("streamText call finished.");

    if (result && result.textStream) {
      console.log("Returning textStream.");
      // Return standard Response with the stream
      return new Response(result.textStream);
    } else {
      console.error("Error: textStream not found on result.");
      return NextResponse.json({ error: 'Internal Server Error: Failed to get stream' }, { status: 500 });
    }

  } catch (error: any) {
    console.error("!!! Critical Error in API route:", error);
    const errorMessage = error.message || 'An unknown error occurred';
    console.error("Error Details:", error.cause || error.stack || error);
    return NextResponse.json({ error: `Internal Server Error: ${errorMessage}` }, { status: 500 });
  }
}