import jwt from "jsonwebtoken";
import { userModel } from "../../database/model/user.model.js";
import {
  badRequest,
  catchError,
  conflictError,
  notFoundError,
} from "../../common/responce/errors.responce.js";
import { env } from "../../config/env.service.js";
import { compareHash, generateHash } from "../../common/utils/generateHash.js";
import { tokenGnerate } from "../../common/utils/generateToken.js";

export const signUp = async (req, res) => {
  const { userName, email, password } = req.body;

  const userEmail = await userModel.findOne({ email });
  if (userEmail) {
    return conflictError({ message: "Email already exist" });
  }
  const hashPassword = await generateHash(password);
  await userModel.create({
    userName,
    email,
    password: hashPassword,
  });

  return res.status(201).json({
    message: "user added",
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return notFoundError({ message: "User not found" });
  }
  const isValid = await compareHash(password, user.password);
  if (!isValid) {
    return badRequest({ message: "Password is incorrect" });
  }
  const token = tokenGnerate(user._id, user.role.trim());
  return res.status(200).json({
    message: "login success",
    token,
  });
};

export const getLogOut = () => {
  return { message: "Logged out successfully" };
};

export const getUser = async (id) => {
  const user = await userModel.findById(id);
  if (user) {
    return { message: "User founded", user };
  } else {
    return notFoundError({ message: "No user founded" });
  }
};

export const editUser = async (id, data) => {
  const { userName, email } = data;
  const editedUser = await userModel.updateOne(
    { _id: id },
    { userName, email },
  );
  if (editedUser.acknowledged) {
    return { message: "user updated" };
  } else {
    return notFoundError({ message: "No user founded" });
  }
};

export const changPassword = async (id, data) => {
  const { password, newPassword, confirmPassword } = data;
  const user = await userModel.findById(id);
  const isValid = await compareHash(password, user.password);
  const hashedNewPassword = await generateHash(newPassword);
  if (isValid) {
    if (newPassword == confirmPassword) {
      const changedPassword = await userModel.updateOne(
        { _id: id },
        { password: hashedNewPassword },
      );
      if (changedPassword.acknowledged) {
        return { message: "user profile updated" };
      } else {
        return { message: "user not updated" };
      }
    } else {
      return unathorized({ message: "Password not match confirm Password " });
    }
  } else {
    return unathorized({ message: "Password is incorrect" });
  }
};
