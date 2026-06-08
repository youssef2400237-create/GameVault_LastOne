import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: "game" },
    totalPrice: { type: Number, required: true },
    quantity: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export const orderModel = mongoose.model("order", orderSchema);
