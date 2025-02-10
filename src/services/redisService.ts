import { createClient } from "redis";

const client = createClient();

client.on("error", (err) => console.error("Redis Client Error", err));

client.connect();

export const getOrderFromCache = async (
  key: string
): Promise<string | null> => {
  return await client.get(key);
};

export const saveOrderToCache = async (
  key: string,
  order: string
): Promise<void> => {
  await client.setEx(key, 600, order); // Expires in 10 min
};

export { client };
