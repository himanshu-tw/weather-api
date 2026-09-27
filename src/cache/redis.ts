// src/cache/redis.ts
import redisClient from '../config/db';

/**
 * Gets data from Redis.
 * Returns null if the key doesn't exist or if there's an error.
 */
export const getCachedData = async (key: string): Promise<any | null> => {
  try {
    const data = await redisClient.get(key);
    if (!data) return null;

    // Redis stores strings, so we must parse it back to an object
    return JSON.parse(data);
  } catch (error) {
    console.error(`[Cache Error] Failed to get key "${key}":`, error);
    return null; // Fail open: let the controller fetch from the external API
  }
};

/**
 * Sets data in Redis with an expiration time (TTL).
 */
export const setCachedData = async (
  key: string,
  data: any,
  ttlSeconds: number = 600 // Default to 10 minutes
): Promise<void> => {
  try {
    // Stringify the object before saving
    const stringifiedData = JSON.stringify(data);

    // The 'EX' option sets the expiration in seconds
    await redisClient.set(key, stringifiedData, { EX: ttlSeconds });
  } catch (error) {
    console.error(`[Cache Error] Failed to set key "${key}":`, error);
    // Fail open: don't crash the app if we can't write to cache
  }
};