// app/api/user/list-count/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth"; // Standard NextAuth import
import { authOptions } from "@/lib/auth"; // Assuming your NextAuth options are here
import { getListsGenerated } from "@/lib/user-storage";

export async function GET() {
  // --- AUTH FIX: Use NextAuth session ---
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id; // Assuming the session object includes user.id

  if (!userId) {
    // Return max count for logged-out users (they get hit by the sign-in modal first)
    return NextResponse.json({ currentCount: 0, maxFreeLists: 3 });
  }

  try {
    const currentCount = await getListsGenerated(userId);

    return NextResponse.json({
      currentCount: currentCount,
      maxFreeLists: 3,
    });
  } catch (error) {
    console.error("Error fetching list count:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
