import {
  badRequest,
  notFoundError,
} from "../../common/responce/errors.responce.js";
import { gameModel } from "../../database/model/games.model.js";
import { orderModel } from "../../database/model/order.model.js";

export const getAllOrders = async () => {
  const orders = await orderModel.find().populate("userId").populate("gameId");
  if (orders) {
    return { message: "orders", orders };
  } else {
    return notFoundError({ message: "No order has been sumbitted yet!" });
  }
};

export const getOrder = async (id) => {
  const order = await orderModel
    .findOne({ _id: id })
    .populate("userId")
    .populate("gameId");
  if (order) {
    return { message: "order", order };
  } else {
    return notFoundError({ message: "No order has been sumbitted yet!" });
  }
};

export const createOrder = async (userId, gameId, data) => {
  const { quantity } = data;
  let totalPrice = 0;
  const game = await gameModel.findOne({ _id: gameId });

  console.log(game);

  if (game.stock < quantity) {
    return badRequest({
      message: "Not enough stock",
    });
  }
  if (game) {
    totalPrice += game.price * quantity;
    game.stock -= quantity;
    await game.save();
  } else {
    return notFoundError({ message: "No game founded yet" });
  }
  const order = await orderModel.insertOne({
    quantity,
    totalPrice,
    userId,
    gameId,
  });
  if (order) {
    return { message: "order:", order };
  } else {
    return notFoundError({ message: "No order has been created yet!" });
  }
};

export const orderEdit = async (id) => {
  const order = await orderModel.findById(id);
  if (!order) {
    return notFoundError({ message: "Order not found" });
  }
  if (order.status !== "pending") {
    return badRequest({ message: "Only pending orders can be cancelled" });
  }
  order.status = "cancelled";
  await order.save();
  return { message: "Order cancelled successfully", order };
};
