import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json(
      { 
        error: 'Lists are currently passed via URL params. Redis caching coming in Phase 5.',
        suggestion: 'The list should be visible if you came from the chat interface.'
      },
      { status: 501 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch list' },
      { status: 500 }
    );
  }
}
