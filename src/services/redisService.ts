import Redis from "ioredis";

let redis: Redis | null = null;

export const initializeRedis = async () => {
  if (redis) {
    return redis;
  }

  redis = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
    retryStrategy: (times) => Math.min(times * 50, 2000),
  });

  redis.on("error", (err) => console.error("Redis Client Error", err));
  return redis;
};

export const getRedisClient = () => {
  if (!redis) {
    throw new Error("Redis client not initialized");
  }
  return redis;
};

export const closeRedis = async () => {
  if (redis) {
    await redis.quit();
    redis = null;
  }
};

export const getOrderFromCache = async (
  key: string
): Promise<string | null> => {
  return getRedisClient().get(key);
};

export const saveOrderToCache = async (
  key: string,
  value: string
): Promise<void> => {
  await getRedisClient().set(key, value);
};

export const getAllFromCache = async (): Promise<string[]> => {
  const redis = getRedisClient();
  const keys = await redis.keys("order:*");
  if (keys.length === 0) return [];

  // Filter out any keys that contain "idempotency:"
  const orderKeys = keys.filter((key) => !key.includes("idempotency:"));
  if (orderKeys.length === 0) return [];

  const values = await redis.mget(orderKeys);
  return values.filter((value): value is string => value !== null);
};

export const deleteFromCache = async (key: string): Promise<void> => {
  await getRedisClient().del(key);
};
