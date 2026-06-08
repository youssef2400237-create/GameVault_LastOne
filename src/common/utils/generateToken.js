import jwt from "jsonwebtoken";
import { env } from "../../config/env.service.js";
export const tokenGnerate = (userId, userRole) => {
  const token = jwt.sign({ id: userId, role: userRole }, env.tokenPassword, {
    expiresIn: "7d",
  });
  return token;
};
