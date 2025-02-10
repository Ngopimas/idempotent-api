import { Request, Response } from "express";
import {
  getOrder,
  saveOrder,
  getAllOrders as getAllOrdersFromDB,
  updateOrder as updateOrderInDB,
  deleteOrder as deleteOrderFromDB,
} from "../services/orderService";

export const createOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  const idempotencyKey = req.headers["idempotency-key"] as string;

  if (!idempotencyKey) {
    res.status(400).json({ error: "Missing Idempotency-Key header" });
    return;
  }

  try {
    const existingOrder = await getOrder(`idempotency:${idempotencyKey}`);
    if (existingOrder) {
      res.json({
        message: "Order already processed",
        order: existingOrder,
      });
      return;
    }

    const orderId = new Date().getTime().toString();
    const order = {
      id: orderId,
      product: req.body.product,
      quantity: req.body.quantity,
    };

    // Store both order and idempotency key
    await saveOrder(orderId, order);
    await saveOrder(`idempotency:${idempotencyKey}`, order);

    res.status(201).json({ message: "Order created", order });
  } catch (error) {
    console.error("Error processing order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getOrderById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const orderId = req.params.id;

  try {
    const order = await getOrder(orderId);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const orders = await getAllOrdersFromDB();
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  const orderId = req.params.id;
  const idempotencyKey = req.headers["idempotency-key"] as string;

  if (!idempotencyKey) {
    res.status(400).json({ error: "Missing Idempotency-Key header" });
    return;
  }

  try {
    const updatedOrder = {
      id: orderId,
      product: req.body.product,
      quantity: req.body.quantity,
    };

    await updateOrderInDB(orderId, updatedOrder);
    res.json({ message: "Order updated", order: updatedOrder });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  const orderId = req.params.id;

  try {
    await deleteOrderFromDB(orderId);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
