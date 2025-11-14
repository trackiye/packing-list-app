// lib/userTracker.ts - Shared user activity tracking function
import { Redis } from "@upstash/redis";

// Initialize Redis client once here
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * Tracks and increments the user count statistics in Redis.
 * This is now a standalone utility function.
 */
export async function trackUserActivity(userId: string) {
  try {
    const today = new Date().toISOString().split("T")[0];
    const key = `stats:users:${today}`;
    const userKey = `stats:user:${userId}:${today}`;

    // Check if user already counted today
    const alreadyCounted = await redis.get(userKey);
    if (alreadyCounted) return;

    // Increment today's count
    await redis.incr(key);

    // Increment total count
    await redis.incr("stats:users:total");

    // Mark user as counted today (expires in 24 hours)
    await redis.set(userKey, 1, { ex: 86400 });
  } catch (error) {
    console.error("Failed to track user activity:", error);
    // Log error but do not block the main API request
  }
}
