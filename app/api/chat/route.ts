import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getListsGenerated, incrementLists, isUserPro } from '@/lib/user-storage';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MAX_FREE_LISTS = 3;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, context, tripName, destination, duration, tripDetails } = body;

    const tripNameFinal = tripName || context?.tripName || message || 'My Trip';
    const destinationFinal = destination || context?.destination || 'Unknown';
    const durationFinal = duration || context?.duration || 7;
    const accommodation = context?.accommodation || '';
    const season = context?.season || '';

    console.log('Generating list for:', { tripNameFinal, destinationFinal, durationFinal, accommodation, season });

    const prompt = `You are a professional travel packing assistant. Create a comprehensive, personalized packing list.

Trip Details:
- Destination: ${destinationFinal}
- Duration: ${durationFinal} days
- Accommodation: ${accommodation}
- Season/Weather: ${season}
${tripDetails ? `- Additional Info: ${tripDetails}` : ''}
${message ? `- User Notes: ${message}` : ''}

IMPORTANT: Start with a brief 1-sentence trip summary describing the trip (e.g., "A week-long beach vacation in tropical Hawaii with resort accommodation").

Then organize the packing list by categories (e.g., Clothing, Electronics, Documents, Toiletries, etc.).
Format with clear category headers (use ## for headers) and bullet points (use - for items).
Be specific and practical. Consider the destination's climate, culture, accommodation type, and trip duration.`;

    console.log('Calling OpenAI...');

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a professional travel packing assistant. Always start responses with a brief trip summary sentence.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const text = completion.choices[0]?.message?.content || 'Error generating list';
    console.log('✅ Generated list:', text.substring(0, 200) + '...');

    const listId = `list-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (userId) {
      const proStatus = await isUserPro(userId);
      if (!proStatus) {
        const currentCount = await getListsGenerated(userId);
        console.log(`User ${userId} has generated ${currentCount} lists`);
        await incrementLists(userId);
      }
    }

    return NextResponse.json({
      listId,
      content: text,
      tripName: tripNameFinal,
      destination: destinationFinal,
      duration: durationFinal.toString(),
      listsRemaining: userId ? (await isUserPro(userId) ? 999 : MAX_FREE_LISTS - (await getListsGenerated(userId))) : null,
      success: true
    });
  } catch (error) {
    console.error('API Error:', error);
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'OpenAI API key not configured.' },
          { status: 500 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
