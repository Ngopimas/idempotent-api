import { Router } from "express";
import {
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController";
import { validateRequest } from "../middleware/validator";
import {
  createOrderSchema,
  updateOrderSchema,
} from "../validations/orderSchema";

const router = Router();

router.post("/orders", validateRequest(createOrderSchema), createOrder);
router.get("/orders", getAllOrders);
router.get("/orders/:id", getOrderById);
router.put("/orders/:id", validateRequest(updateOrderSchema), updateOrder);
router.delete("/orders/:id", deleteOrder);

export default router;
