import { Router } from "express";
import { getAllGames, getGameById } from "./games.service.js";
const router = Router();
router.get("/get-all-games", async (req, res) => {
  const games = await getAllGames();
  res.json(games);
});
router.get("/games/:id", async (req, res) => {
  const { id } = req.params;
  const getedGame = await getGameById(id);
  res.json(getedGame);
});

export default router;
