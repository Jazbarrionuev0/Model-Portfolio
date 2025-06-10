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
    return data ? JSON.parse(data) : [];
  } catch (error) {
    logError(`Error fetching ${key} data`, error);
    throw error;
  }
};

export const setRedisData = async <T>(key: string, data: T[]): Promise<void> => {
  try {
    logInfo(`Setting ${key} data`);
    const client = await getRedisClient();
    await client.set(key, JSON.stringify(data));
    logInfo(`${key} data set successfully`);
  } catch (error) {
    logError(`Error setting ${key} data`, error);
    throw error;
  }
};
