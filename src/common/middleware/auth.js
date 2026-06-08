import jwt from "jsonwebtoken";
import { env } from "../../config/env.service.js";
import { unathorized } from "../responce/errors.responce.js";
export const auth = (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return unathorized({ message: "Missing token header" });
    }
    const decoded = jwt.verify(token, env.tokenPassword);
    req.user = decoded;
    next();
  } catch (error) {
    return unathorized({ message: "Invalid token" });
  }
};
