// app/api/chat/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getListsGenerated, incrementLists, isUserPro } from '@/lib/user-storage'; // Ensure functions are imported

const MAX_FREE_LISTS = 3; 

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
         // Return plain text "Unauthorized" which HeroForm.tsx is now ready to handle.
         return new NextResponse('Unauthorized: Please sign in to generate a list.', { status: 401 });
    }

    try {
        // Check if user is Pro
        const proStatus = await isUserPro(userId);

        if (!proStatus) {
            // Get current list count
            const currentCount = await getListsGenerated(userId);

            // Paywall Check
            if (currentCount >= MAX_FREE_LISTS) {
                return NextResponse.json({
                    error: 'LIST_LIMIT_REACHED',
                    message: `You have reached your limit of ${MAX_FREE_LISTS} free lists.`
                }, { status: 402 }); // 402 Payment Required
            }
        }

        // --- DUMMY LIST GENERATION LOGIC ---
        // Simulates the list generation process
        const listId = `list-${Date.now()}`; 

        // 3. Increment list count if not Pro
        if (!proStatus) {
            await incrementLists(userId);
        }

        // Return successful JSON response
        return NextResponse.json({
            listId: listId,
            listsRemaining: proStatus ? 999 : MAX_FREE_LISTS - (await getListsGenerated(userId)),
            success: true
        });

    } catch (error) {
        console.error("API Error during list generation:", error);
        return new NextResponse('Internal Server Error during list generation.', { status: 500 });
    }
}
