import mongoose from "mongoose";

const userTable = new mongoose.Schema(
  {
    userName: {
      type: String,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [20, "Username can't be more than 20 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      maxlength: [220, "Password can't exceed 30 characters"],
    },

    age: {
      type: Number,
      min: [18, "Age must be at least 18"],
      max: [80, "Age can't be more than 80"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  },
);

export const userModel = mongoose.model("user", userTable);
