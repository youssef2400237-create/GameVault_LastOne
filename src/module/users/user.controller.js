import { Router } from "express";
import { userModel } from "../../database/model/user.model.js";
import {
  changPassword,
  editUser,
  getLogOut,
  getUser,
  login,
  signUp,
} from "./user.service.js";
import { auth } from "../../common/middleware/auth.js";
import {
  changePasswordValidation,
  loginValidation,
  signUpValidation,
  validate,
} from "../../common/middleware/validation.js";
import { compareHash } from "../../common/utils/generateHash.js";
const router = Router();
router.post("/sign-up", signUpValidation, signUp);
router.post("/login", loginValidation, login);
router.get("/logout", async (req, res) => {
  const user = await getLogOut();
  res.status(200).json(user);
});
router.get("/get-profile", auth, async (req, res) => {
  const user = await getUser(req.user.id);
  res.status(200).json(user);
});
router.put("/edit-profile", auth, async (req, res) => {
  const editedUser = await editUser(req.user.id, req.body);
  res.status(200).json(editedUser);
});
router.put(
  "/change-password",
  changePasswordValidation,
  validate,
  auth,
  async (req, res) => {
    const changedPassword = await changPassword(req.user.id, req.body);
    res.status(200).json(changedPassword);
  },
);
// ===== Verify Password for Checkout =====
router.post("/verify-password", auth, async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isValid = await compareHash(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    return res.status(200).json({ message: "Password verified", userId: user._id });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});
export default router;
