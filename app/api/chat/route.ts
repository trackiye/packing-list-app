// app/api/chat/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server'; // Assuming Clerk for auth
import { getListsGenerated, incrementLists, isUserPro } from '@/lib/user-storage'; // New imports
import { z } from 'zod';
// Assuming your AI function is called 'getAiResponse' and takes a prompt/request
// import { getAiResponse } from '@/lib/ai-service'; 

// Secure Schema for input validation
const chatRequestSchema = z.object({
  tripDetails: z.string().min(10, "Trip details are too short.").max(1000),
  // Add other relevant fields if your chat/list API takes them
});

const MAX_FREE_LISTS = 3;

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const json = await req.json();
    // Validate and parse the input
    const validatedData = chatRequestSchema.parse(json);

    // --- CORE PAYWALL CHECK ---
    const isPro = await isUserPro(userId);
    const currentCount = await getListsGenerated(userId);

    if (!isPro && currentCount >= MAX_FREE_LISTS) {
      return new NextResponse(JSON.stringify({
        error: 'LIST_LIMIT_REACHED',
        message: `You have reached your limit of ${MAX_FREE_LISTS} free lists. Please upgrade!`,
        listsRemaining: 0
      }), { status: 402 }); // 402 Payment Required
    }
    // --- END CORE PAYWALL CHECK ---

    // 1. Generate the list (replace with your actual AI call)
    // const listResponse = await getAiResponse(validatedData.tripDetails);
    const listResponse = { 
        message: "List generated successfully.", 
        listId: `list-${Date.now()}`,
        // NOTE: Replace this mock list object with the actual response from your OpenAI/AI service.
        packingList: [
            "4x T-Shirts",
            "2x Pairs of Jeans",
            "1x Toothbrush",
            "1x Passport",
        ]
    };

    // 2. Increment the counter ONLY if the user is NOT Pro
    if (!isPro) {
      await incrementLists(userId);
    }
    const newCount = await getListsGenerated(userId);

    // Return the list and the updated remaining count
    return NextResponse.json({
      ...listResponse,
      listsRemaining: Math.max(0, MAX_FREE_LISTS - newCount)
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify({ error: 'Invalid input', details: error.issues }), { status: 400 });
    }
    console.error('List generation error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
