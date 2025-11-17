// app/api/chat/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth"; // Standard NextAuth import
import { authOptions } from "@/lib/auth"; // Assuming your NextAuth options are here
import {
  getListsGenerated,
  incrementLists,
  isUserPro,
} from "@/lib/user-storage";
import { z } from "zod";
// import { getAiResponse } from '@/lib/ai-service';

const chatRequestSchema = z.object({
  tripDetails: z.string().min(10, "Trip details are too short.").max(1000),
});

const MAX_FREE_LISTS = 3;

export async function POST(req: Request) {
  // --- AUTH FIX: Use NextAuth session ---
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id; // Assuming the session object includes user.id

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const json = await req.json();
    const validatedData = chatRequestSchema.parse(json);

    // --- CORE PAYWALL CHECK ---
    const isPro = await isUserPro(userId);
    const currentCount = await getListsGenerated(userId);

    if (!isPro && currentCount >= MAX_FREE_LISTS) {
      return new NextResponse(
        JSON.stringify({
          error: "LIST_LIMIT_REACHED",
          message: `You have reached your limit of ${MAX_FREE_LISTS} free lists. Please upgrade!`,
          listsRemaining: 0,
        }),
        { status: 402 }
      ); // 402 Payment Required
    }
    // --- END CORE PAYWALL CHECK ---

    // 1. Generate the list (replace with your actual AI call)
    // const listResponse = await getAiResponse(validatedData.tripDetails);
    const listResponse = {
      message: "List generated successfully.",
      listId: `list-${Date.now()}`,
      packingList: [
        "4x T-Shirts",
        "2x Pairs of Jeans",
        "1x Toothbrush",
        "1x Passport",
      ],
    };

    // 2. Increment the counter ONLY if the user is NOT Pro
    if (!isPro) {
      await incrementLists(userId);
    }
    const newCount = await getListsGenerated(userId);

    return NextResponse.json({
      ...listResponse,
      listsRemaining: Math.max(0, MAX_FREE_LISTS - newCount),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid input", details: error.issues }),
        { status: 400 }
      );
    }
    console.error("List generation error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
