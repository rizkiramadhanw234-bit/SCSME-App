import { Router } from "express";
import {
  getAdPlacements,
  getAdPlacementById,
  createAdPlacement,
  updateAdPlacement,
  deleteAdPlacements,
} from "../controllers/adPlacements.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/admin.middleware";

const router = Router();

router.get("/", authMiddleware, isAdmin, getAdPlacements);
router.get("/:id", authMiddleware, isAdmin, getAdPlacementById);
router.post("/create", authMiddleware, isAdmin, createAdPlacement);
router.put("/update/:id", authMiddleware, isAdmin, updateAdPlacement);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteAdPlacements);

export default router;
