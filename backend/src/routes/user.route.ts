import { Router } from "express";
import {
  getUserById,
  createUser,
  loginUser,
  logoutUser,
  updateUser,
  refreshToken,
  getUserByEmail,
} from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/email", getUserByEmail);
router.post("/register", createUser);
router.get("/:id", authMiddleware, getUserById);
router.put("/update/:id", authMiddleware, updateUser);

// auth
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// refresh token
router.post("/refresh-token", refreshToken);

export default router;
