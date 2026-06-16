import { Router } from "express";
import {
  getCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/admin.middleware";

const router = Router();

router.get("/", getCategories);
router.get("/get/:id", authMiddleware, getCategoryById);
router.post("/create", authMiddleware, isAdmin, createCategory);
router.put("/update/:id", authMiddleware, isAdmin, updateCategory);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteCategory);

export default router;
