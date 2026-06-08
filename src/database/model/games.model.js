import mongoose from "mongoose";
const gameSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    genre: { type: String },
    platform: { type: String },
    imageUrl: { type: String },
    stock: { type: Number, default: 0 },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  },
  { timestamps: true },
);

export const gameModel = mongoose.model("game", gameSchema);
