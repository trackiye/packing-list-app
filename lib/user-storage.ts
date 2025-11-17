// lib/user-storage.ts
import { Redis } from 'ioredis';
const redis = new Redis(process.env.UPSTASH_REDIS_URL as string);
const LIST_COUNT_TTL = 60 * 60 * 24 * 365;
const getKey = (userId: string) => `user:listsGenerated:${userId}`;
export async function getListsGenerated(userId: string): Promise<number> {
  const count = await redis.get(getKey(userId));
  return count ? parseInt(count, 10) : 0;
}
export async function incrementLists(userId: string): Promise<void> {
  await redis.incr(getKey(userId));
  await redis.expire(getKey(userId), LIST_COUNT_TTL);
}
export async function isUserPro(userId: string): Promise<boolean> {
    const proStatus = await redis.get(`user:pro:${userId}`);
    return proStatus === 'true';
}
