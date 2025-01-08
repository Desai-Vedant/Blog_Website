import express from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
  getUserName,
} from "../controllers/authController.js";
import { authenticateToken } from "../utils/authorization.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/logout", logoutUser);
router.post("/getname", authenticateToken, getUserName);

export default router;
