import { createClient, RedisClientType } from "redis";

let client: RedisClientType | null = null;

export const initializeRedis = async () => {
  if (client) {
    return client;
  }

  client = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
    socket: {
      reconnectStrategy: (retries) => Math.min(retries * 50, 1000),
    },
  });

  client.on("error", (err) => console.error("Redis Client Error", err));

  await client.connect();
  return client;
};

export const getRedisClient = () => {
  if (!client) {
    throw new Error("Redis client not initialized");
  }
  return client;
};

export const closeRedis = async () => {
  if (client) {
    await client.disconnect();
    client = null;
  }
};

export const getOrderFromCache = async (
  key: string
): Promise<string | null> => {
  return await getRedisClient().get(key);
};

export const saveOrderToCache = async (
  key: string,
  order: string
): Promise<void> => {
  await getRedisClient().setEx(key, 600, order); // Expires in 10 min
};
