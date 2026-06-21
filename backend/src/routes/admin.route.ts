import { Router } from "express";
import {
  getAdmins,
  createAdmin,
  updateAdmin,
  loginAdmin,
  logoutAdmiin,
  deleteAdmin,
  getAdminById,
  getAdminByEmail,
} from "../controllers/admin.controller";

import {
  getUsers,
  getUserByEmail,
  searchUserByName,
  deleteUser,
} from "../controllers/user.controller";

import { isAdmin } from "../middleware/admin.middleware";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// admin
router.get("/", getAdmins);
router.get("/:id", authMiddleware, getAdminById);
router.get("/email", authMiddleware, getAdminByEmail);
router.post("/logout", authMiddleware, logoutAdmiin);
router.put("/update/:id", authMiddleware, updateAdmin);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteAdmin);

// get user by admin
router.get("/users", authMiddleware, getUsers);
router.get("/user/email", authMiddleware, getUserByEmail);
router.get("/user/search", authMiddleware, searchUserByName);
router.delete("/user/:id", authMiddleware, deleteUser);

// auth
router.post("/create", createAdmin);
router.post("/login", loginAdmin);

export default router;
