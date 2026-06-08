import { Router } from "express";
import {
  addUser,
  createGames,
  deleteGame,
  deleteUser,
  editGames,
  editUser,
  getAllGmes,
  getAllOrders,
  getUser,
  getUserById,
} from "./admin.service.js";
import { auth } from "../../common/middleware/auth.js";
const router = Router();
// user
router.get("/get-user-by-admin", auth, async (req, res) => {
  const role = req.user.role;
  const users = await getUser(role);
  res.status(200).json(users);
});
router.get("/get-user-by-id/:id", auth, async (req, res) => {
  const { id } = req.params;
  const role = req.user.role;
  const user = await getUserById(role, id);
  res.status(200).json(user);
});
router.post("/add-user", auth, async (req, res) => {
  const role = req.user.role;
  const addedUser = await addUser(role, req.body);
  res.status(201).json(addedUser);
});
router.put("/edit-user/:id", auth, async (req, res) => {
  const role = req.user.role;
  const { id } = req.params;
  const editedUser = await editUser(role, id, req.body);
  res.status(200).json(editedUser);
});
router.delete("/delete-user/:id", auth, async (req, res, next) => {
  const { id } = req.params;
  const isAdmin = req.user.role;
  const deletedUser = await deleteUser(id, isAdmin, next);
  res.status(200).json(deletedUser);
});
// games
router.get("/get-games", auth, async (req, res) => {
  const role = req.user.role;
  const games = await getAllGmes(role);
  res.status(200).json(games);
});
router.put("/edit-games/:gameId", auth, async (req, res) => {
  const role = req.user.role;
  const { gameId } = req.params;
  const editedGame = await editGames(role, gameId, req.body);
  res.status(200).json(editedGame);
});
router.post("/create-games/:userId", auth, async (req, res) => {
  const { userId } = req.params;
  const role = req.user.role;
  const gamesCreates = await createGames(role, req.body, userId);
  res.status(201).json(gamesCreates);
});
router.delete("/delete-game/:gameId", auth, async (req, res) => {
  const { gameId } = req.params;
  const role = req.user.role;
  const deletedGame = await deleteGame(gameId, role);
  res.status(200).json(deletedGame);
});
// orders
router.get("/get-orders-by-admin", auth, async (req, res) => {
  const role = req.user.role;
  const orders = await getAllOrders(role);
  res.status(200).json(orders);
});

export default router;
