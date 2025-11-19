import { Redis } from '@upstash/redis';

// Initialize Redis client
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// Cache duration: 24 hours
const CACHE_TTL = 60 * 60 * 24;

interface CachedList {
  content: string;
  tripName: string;
  destination: string;
  duration: string;
  timestamp: number;
}

/**
 * Generate a cache key from trip parameters
 */
export function generateCacheKey(
  destination: string,
  duration: number,
  accommodation: string,
  season: string
): string {
  const normalized = [
    destination.toLowerCase().trim(),
    duration.toString(),
    accommodation.toLowerCase().trim(),
    season.toLowerCase().trim(),
  ].join(':');
  
  return `list:${normalized}`;
}

/**
 * Get cached list
 */
export async function getCachedList(cacheKey: string): Promise<CachedList | null> {
  if (!redis) return null;

  try {
    const cached = await redis.get<CachedList>(cacheKey);
    
    if (cached) {
      console.log('✅ Cache HIT:', cacheKey);
      return cached;
    }
    
    console.log('❌ Cache MISS:', cacheKey);
    return null;
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
}

/**
 * Set cached list
 */
export async function setCachedList(
  cacheKey: string,
  data: CachedList
): Promise<void> {
  if (!redis) return;

  try {
    await redis.set(cacheKey, data, { ex: CACHE_TTL });
    console.log('💾 Cached list:', cacheKey);
  } catch (error) {
    console.error('Cache write error:', error);
  }
}

/**
 * Get cache stats (optional, for debugging)
 */
export async function getCacheStats(): Promise<{ hits: number; misses: number } | null> {
  if (!redis) return null;

  try {
    const info = await redis.info();
    // Parse Redis INFO command output for stats
    return { hits: 0, misses: 0 }; // Simplified
  } catch (error) {
    console.error('Cache stats error:', error);
    return null;
  }
}
