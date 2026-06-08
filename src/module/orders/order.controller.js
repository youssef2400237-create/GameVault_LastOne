import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  getOrder,
  orderEdit,
} from "./order.service.js";
const router = Router();
router.get("/get-orders", async (req, res) => {
  const orders = await getAllOrders();
  res.json(orders);
});

router.get("/get-order/:id", async (req, res) => {
  const { id } = req.params;
  const order = await getOrder(id);
  res.json(order);
});

router.post("/create-order/:userId/:gameId", async (req, res) => {
  const { userId, gameId } = req.params;
  const createdOrder = await createOrder(userId, gameId, req.body);
  res.json(createdOrder);
});

router.put("/edit-order/:id", async (req, res) => {
  const { id } = req.params;
  const editedOrder = await orderEdit(id);
  res.json(editedOrder);
});

export default router;
