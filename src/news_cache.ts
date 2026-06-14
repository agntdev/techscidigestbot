import Redis from "ioredis";
import type { NewsArticle } from "./db/types";

const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";
const CACHE_TTL = 24 * 60 * 60;

let redis: Redis | null = null;

function getRedis(): Redis {
  if (!redis) {
    redis = new Redis(REDIS_URL, { lazyConnect: true });
  }
  return redis;
}

export async function getCachedHeadlines(
  category: string,
): Promise<NewsArticle[] | null> {
  try {
    const client = getRedis();
    const data = await client.get(`news:${category}`);
    if (!data) return null;
    return JSON.parse(data) as NewsArticle[];
  } catch {
    return null;
  }
}

export async function setCachedHeadlines(
  category: string,
  articles: NewsArticle[],
): Promise<void> {
  try {
    const client = getRedis();
    await client.set(
      `news:${category}`,
      JSON.stringify(articles),
      "EX",
      CACHE_TTL,
    );
  } catch {
    // silent
  }
}

export async function invalidateCache(): Promise<void> {
  try {
    const client = getRedis();
    const keys = await client.keys("news:*");
    if (keys.length > 0) {
      await client.del(...keys);
    }
  } catch {
    // silent
  }
}

export async function disconnectRedis(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
  }
}
