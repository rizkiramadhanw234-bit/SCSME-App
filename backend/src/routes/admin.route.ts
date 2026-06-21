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
router.get("/email", authMiddleware, getAdminByEmail);

// get user by admin
router.get("/users", authMiddleware, isAdmin, getUsers);
router.get("/user/email", authMiddleware, isAdmin, getUserByEmail);
router.get("/user/search", authMiddleware, isAdmin, searchUserByName);

// admin
router.get("/:id", authMiddleware, getAdminById);
router.post("/logout", authMiddleware, logoutAdmiin);
router.put("/update/:id", authMiddleware, isAdmin, updateAdmin);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteAdmin);
router.delete("/user/:id", authMiddleware, isAdmin, deleteUser);

// auth
router.post("/create", createAdmin);
router.post("/login", loginAdmin);

export default router;
