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

router.get("/", getAdmins);
router.get("/get/email", authMiddleware, isAdmin, getAdminByEmail);
router.get("/get/:id", authMiddleware, isAdmin, getAdminById);
router.post("/create", createAdmin);
router.put("/update/:id", authMiddleware, isAdmin, updateAdmin);
router.post("/login", loginAdmin);
router.post("/logout", authMiddleware, logoutAdmiin);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteAdmin);

router.get("/users", authMiddleware, isAdmin, getUsers);
router.get("/user/email", authMiddleware, isAdmin, getUserByEmail);
router.get("/user/search", authMiddleware, isAdmin, searchUserByName);
router.delete("/user/:id", authMiddleware, isAdmin, deleteUser);

export default router;
