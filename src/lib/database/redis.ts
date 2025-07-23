import { createClient, RedisClientType } from "redis";
import { logError, logInfo } from "@/lib/utils";

let redisClient: RedisClientType | null = null;

export const getRedisClient = async (): Promise<RedisClientType> => {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS!,
      socket: {
        tls: true,
        reconnectStrategy: (retries) => Math.min(retries * 50, 1000),
      },
    });
    await redisClient.connect().catch((err) => {
      logError("Redis connection error", err);
      throw err;
    });
    logInfo("Redis client connected");
  }
  return redisClient;
};

export const getRedisData = async <T>(key: string): Promise<T[]> => {
  try {
    logInfo(`Fetching ${key} data`);
    const client = await getRedisClient();
    const data = await client.get(key);
    const result = data ? JSON.parse(data) : [];
    logInfo(`Successfully fetched ${key} data`, { count: result.length });
    return result;
  } catch (error) {
    logError(`Error fetching ${key} data`, error);
    // Return empty array instead of throwing to prevent complete app failure
    return [];
  }
};

export const setRedisData = async <T>(key: string, data: T[]): Promise<void> => {
  try {
    logInfo(`Setting ${key} data`, { count: data.length });
    const client = await getRedisClient();
    await client.set(key, JSON.stringify(data));
    logInfo(`${key} data set successfully`);
  } catch (error) {
    logError(`Error setting ${key} data`, error);
    // Re-throw for write operations as we need to know if they failed
    throw new Error(`Failed to save ${key} data: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};
