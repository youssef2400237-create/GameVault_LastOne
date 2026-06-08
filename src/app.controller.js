import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { databaseConnection } from "./database/connection.js";
import userRouter from "./module/users/user.controller.js";
import adminRouter from "./module/admin/admin.controller.js";
import gamesRouter from "./module/games/games.controller.js";
import orderRouter from "./module/orders/order.controller.js";
import {
  catchError,
  notFoundError,
} from "./common/responce/errors.responce.js";
import { env } from "./config/env.service.js";
import { gameModel } from "./database/model/games.model.js";
import { userModel } from "./database/model/user.model.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, ".."); 

export const boostrap = () => {
  const app = express();

  
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

 
  app.use("/styles", express.static(path.join(ROOT, "styles")));
  app.use("/scriptes", express.static(path.join(ROOT, "scriptes")));
  app.use("/assets", express.static(path.join(ROOT, "assets")));

 
  app.set("view engine", "ejs");
  app.set("views", path.join(ROOT, "views"));

 
  databaseConnection();

 
  app.use("/api/users", userRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/games", gamesRouter);
  app.use("/api/orders", orderRouter);

  
  app.get("/", (req, res) => {
    res.render("login", { error: null });
  });



  app.get("/register", (req, res) => {
    res.render("signup", { error: null, success: null });
  });

  app.get("/home", async (req, res) => {
    try {
      const games = await gameModel.find().limit(6).lean();
      res.render("home", { games });
    } catch (err) {
      res.render("home", { games: [] });
    }
  });

  app.get("/store", async (req, res) => {
    try {
      const games = await gameModel.find().lean();
      res.render("store", { games });
    } catch (err) {
      res.render("store", { games: [] });
    }
  });

  app.get("/trending", async (req, res) => {
    try {
      const games = await gameModel.find().limit(3).lean();
      res.render("trending", { games });
    } catch (err) {
      res.render("trending", { games: [] });
    }
  });

  app.get("/friends", (req, res) => {
    res.render("friends");
  });

  app.get("/downloads", (req, res) => {
    res.render("downloads");
  });

  app.get("/profile", (req, res) => {
    res.render("profile", {
      user: {
        avatar:
          "../assets/young-man-enjoying-games-with-headset-on-transparent-background-png.webp",
        userName: "Ahmed",
        email: "ahmed@gmail.com",
        role: "user",
        ordersCount: 5,
        gamesCount: 12,
        favoritesCount: 3,
      },
    });
  });

  app.get("/dashboard", async (req, res) => {
    try {
      const totalUsers = await userModel.countDocuments();
      const totalGames = await gameModel.countDocuments();
      const stats = {
        totalUsers,
        totalGames,
        activeUsers: totalUsers,
        totalRevenue: (totalGames * 49.99).toFixed(0),
      };
      res.render("dashboard", { stats, user: { userName: "Admin" } });
    } catch (err) {
      res.render("dashboard", {
        stats: {
          totalUsers: 0,
          totalGames: 0,
          activeUsers: 0,
          totalRevenue: 0,
        },
        user: { userName: "Admin" },
      });
    }
  });

  app.use((req, res) => {
    res.status(404).json({ message: "Page not found" });
  });

  app.use(catchError);

  app.listen(env.port, () =>
    console.log(`✅ Server is running on http://localhost:${env.port}`),
  );
};
