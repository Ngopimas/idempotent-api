import { Request, Response } from "express";
import { getOrder, saveOrder } from "../services/orderService";

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
    const existingOrder = await getOrder(idempotencyKey);
    if (existingOrder) {
      res.json({
        message: "Order already processed",
        order: existingOrder,
      });
      return;
    }

    const order = {
      id: new Date().getTime().toString(), // Simplified ID
      product: req.body.product,
      quantity: req.body.quantity,
    };

    await saveOrder(idempotencyKey, order);

    res.status(201).json({ message: "Order created", order });
  } catch (error) {
    console.error("Error processing order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
