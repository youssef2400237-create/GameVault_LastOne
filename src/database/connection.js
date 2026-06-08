import mongoose from "mongoose";
import { env } from "../config/env.service.js";
export const databaseConnection = () => {
  mongoose
    .connect(env.databaseUrl)
    .then(() => console.log("database is running"))
    .catch((err) => console.log(err));
}; 
