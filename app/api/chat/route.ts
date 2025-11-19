import { OpenAIStream, StreamingTextResponse } from 'ai';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getListsGenerated, incrementLists, isUserPro } from '@/lib/user-storage';
import { generateCacheKey, getCachedList, setCachedList } from '@/lib/cache';
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

    // Generate cache key
    const cacheKey = generateCacheKey(
      destinationFinal,
      durationFinal,
      accommodation,
      season
    );

    // Check cache first
    const cached = await getCachedList(cacheKey);
    
    if (cached) {
      console.log('🚀 Cache HIT - Instant response!');
      
      const session = await getServerSession(authOptions);
      const userId = session?.user ? (session.user as { id?: string }).id : undefined;

      let listsUsed = 0;
      let isPro = false;

      if (userId) {
        isPro = await isUserPro(userId);
        if (!isPro) {
          await incrementLists(userId);
        }
        listsUsed = await getListsGenerated(userId);
      }

      const listId = `list-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Return cached result immediately (not streaming)
      return Response.json({
        listId,
        content: cached.content,
        tripName: tripNameFinal,
        destination: destinationFinal,
        duration: durationFinal.toString(),
        listsUsed,
        isPro,
        cached: true,
        success: true
      });
    }

    // Not cached - stream from OpenAI
    console.log('🤖 Cache MISS - Streaming from OpenAI...');

    const prompt = `You are a professional travel packing assistant. Create a comprehensive, personalized packing list.

Trip Details:
- Destination: ${destinationFinal}
- Duration: ${durationFinal} days
- Accommodation: ${accommodation}
- Season/Weather: ${season}
${tripDetails ? `- Additional Info: ${tripDetails}` : ''}
${message ? `- User Notes: ${message}` : ''}

IMPORTANT: Start with a brief 1-sentence trip summary describing the trip.

Then organize the packing list by categories (e.g., Clothing, Electronics, Documents, Toiletries, etc.).
Format with clear category headers (use ## for headers) and bullet points (use - for items).
Be specific and practical.`;

    const session = await getServerSession(authOptions);
    const userId = session?.user ? (session.user as { id?: string }).id : undefined;

    let isPro = false;
    if (userId) {
      isPro = await isUserPro(userId);
    }

    // Start streaming response
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      stream: true,
      messages: [
        { role: 'system', content: 'You are a professional travel packing assistant.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Convert to streaming response
    const stream = OpenAIStream(response, {
      async onCompletion(completion) {
        console.log('✅ Stream completed, caching result...');
        
        // Cache the completed result
        await setCachedList(cacheKey, {
          content: completion,
          tripName: tripNameFinal,
          destination: destinationFinal,
          duration: durationFinal.toString(),
          timestamp: Date.now(),
        });

        // Increment usage
        if (userId && !isPro) {
          await incrementLists(userId);
        }
      },
    });

    return new StreamingTextResponse(stream, {
      headers: {
        'X-List-Id': `list-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        'X-Trip-Name': tripNameFinal,
        'X-Destination': destinationFinal,
        'X-Duration': durationFinal.toString(),
        'X-Is-Pro': isPro.toString(),
      },
    });

  } catch (error) {
    console.error('API Error:', error);
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
