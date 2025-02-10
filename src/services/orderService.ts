import { getOrderFromCache, saveOrderToCache } from "./redisService";
import { Order } from "../types/order";

export const getOrder = async (key: string): Promise<Order | null> => {
  const order = await getOrderFromCache(key);
  return order ? JSON.parse(order) : null;
};

export const saveOrder = async (key: string, order: Order): Promise<void> => {
  await saveOrderToCache(key, JSON.stringify(order));
};
