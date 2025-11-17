// app/api/user/list-count/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getListsGenerated } from '@/lib/user-storage';

export async function GET() {
  const { userId } = auth();
  if (!userId) { 
    // Return max count for logged-out users (they get hit by the sign-in modal first)
    return NextResponse.json({ currentCount: 0, maxFreeLists: 3 }); 
  }

  try {
    const currentCount = await getListsGenerated(userId);

    return NextResponse.json({
      currentCount: currentCount,
      maxFreeLists: 3
    });
  } catch (error) {
    console.error('Error fetching list count:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}