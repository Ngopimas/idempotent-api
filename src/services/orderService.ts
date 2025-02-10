import {
  getAllFromCache,
  getOrderFromCache,
  saveOrderToCache,
  deleteFromCache,
} from "./redisService";
import { Order } from "../types/order";

const generateOrderKey = (id: string) => `order:${id}`;

export const getOrder = async (id: string): Promise<Order | null> => {
  const order = await getOrderFromCache(generateOrderKey(id));
  return order ? JSON.parse(order) : null;
};

export const saveOrder = async (id: string, order: Order): Promise<void> => {
  await saveOrderToCache(generateOrderKey(id), JSON.stringify(order));
  // Also store by idempotency key if provided
  if (id.startsWith("idempotency:")) {
    await saveOrderToCache(id, JSON.stringify(order));
  }
};

export const getAllOrders = async (): Promise<Order[]> => {
  const orders = await getAllFromCache();
  return orders.map((order) => JSON.parse(order));
};

export const updateOrder = async (id: string, order: Order): Promise<void> => {
  await saveOrderToCache(generateOrderKey(id), JSON.stringify(order));
};

export const deleteOrder = async (id: string): Promise<void> => {
  await deleteFromCache(generateOrderKey(id));
};
