import {
  badRequest,
  conflictError,
  forbidden,
  notFoundError,
} from "../../common/responce/errors.responce.js";
import { env } from "../../config/env.service.js";
import { userModel } from "../../database/model/user.model.js";
import jwt from "jsonwebtoken";
import { gameModel } from "../../database/model/games.model.js";
import { orderModel } from "../../database/model/order.model.js";
import { generateHash } from "../../common/utils/generateHash.js";
// users
export const getUser = async (role) => {
  if (role == "admin") {
    const users = await userModel.find();
    if (users) {
      return { message: "users founded", data: users };
    } else {
      return notFoundError({ message: "no users" });
    }
  } else {
    return forbidden({ message: "only admins can show users" });
  }
};

export const getUserById = async (role, id) => {
  if (role == "admin") {
    const user = await userModel.findOne({ _id: id });
    if (user) {
      return { message: "user founded", data: user };
    } else {
      return notFoundError({ message: "no user" });
    }
  } else {
    return forbidden({ message: "only admins can show user" });
  }
};

export const deleteUser = async (id, role, next) => {
  if (role == "admin") {
    const deletedUser = await userModel.deleteOne({
      _id: id,
    });
    if (deletedUser.deletedCount > 0) {
      return { message: "user deleted succ" };
    } else {
      return notFoundError({ message: "user not found" });
    }
  } else {
    return forbidden({ message: "only admins can delete users" });
  }
};
export const addUser = async (roleAdmin, data) => {
  if (roleAdmin == "admin") {
    const { userName, email, password, role, age } = data;
    if (role == "admin") {
      return badRequest({
        message: "you can't be admin , olny one admin valid",
      });
    }
    const hashedPassword = await generateHash(password);
    const emailVlide = await userModel.findOne({ email });
    if (emailVlide) {
      return conflictError({ message: "Email already exist" });
    }
    const addedUser = await userModel.insertOne({
      userName,
      email,
      password: hashedPassword,
      role,
      age,
    });
    if (addedUser) {
      return { message: "User added" };
    } else {
      return badRequest({ message: "No user added" });
    }
  } else {
    return forbidden({ message: "only admins can add user" });
  }
};

export const editUser = async (roleAdmin, id, data) => {
  if (roleAdmin == "admin") {
    const { userName, email, age } = data;
    const emailExists = await userModel.findOne({ email });
    if (emailExists) {
      return conflictError({ message: "Email already Exist" });
    }
    const updatedUser = await userModel.updateOne(
      { _id: id },
      { userName, email, age },
    );
    if (updatedUser.acknowledged) {
      return { message: "User updated" };
    } else {
      return notFoundError({ message: "User not found" });
    }
  } else {
    return forbidden({ message: "only admins can edit user" });
  }
};

// games
export const getAllGmes = async (role) => {
  if (role == "admin") {
    const games = await gameModel.find();
    if (games) {
      return { message: "games founded", data: games };
    } else {
      return notFoundError({ message: "no games founded" });
    }
  } else {
    return forbidden({ message: "only admins can show games" });
  }
};

export const createGames = async (role, data, userId) => {
  if (role == "admin") {
    const { title, price, imageUrl, description, genre, stock } = data;
    const addGame = await gameModel.insertOne({
      title,
      price,
      userId,
      imageUrl: imageUrl || "",
      description: description || "",
      genre: genre || "General",
      stock: stock || 10,
    });
    if (addGame) {
      return { message: "Game created" };
    } else {
      return badRequest({ message: "No game created" });
    }
  } else {
    return forbidden({ message: "only admins can create games" });
  }
};

export const editGames = async (role, gameId, data) => {
  if (role == "admin") {
    const { title, price, imageUrl, genre, stock } = data;
    const updateFields = { title, price };
    if (imageUrl !== undefined) updateFields.imageUrl = imageUrl;
    if (genre !== undefined) updateFields.genre = genre;
    if (stock !== undefined) updateFields.stock = stock;
    const editedGame = await gameModel.updateOne({ _id: gameId }, updateFields);
    if (editedGame.acknowledged) {
      return { message: "Game edited" };
    } else {
      return badRequest({ message: "No game edited" });
    }
  } else {
    return forbidden({ message: "only admins can edit games" });
  }
};

export const deleteGame = async (gameId, role) => {
  if (role == "admin") {
    const deletedGame = await gameModel.deleteOne({
      _id: gameId,
    });
    if (deletedGame.deletedCount > 0) {
      return { message: "game deleted succ" };
    } else {
      return notFoundError({ message: "game not found" });
    }
  } else {
    return forbidden({ message: "only admins can delete games" });
  }
};

// orders
export const getAllOrders = async (role) => {
  if (role == "admin") {
    const orders = await orderModel
      .find()
      .select("-createdAt -updatedAt")
      .populate("userId", "-createdAt -updatedAt -__v")
      .populate("gameId", "-createdAt -updatedAt -__v");
    if (orders) {
      return { message: "orders founded", data: orders };
    } else {
      return notFoundError({ message: "no orders founded" });
    }
  } else {
    return forbidden({ message: "only admins can show orders" });
  }
};
