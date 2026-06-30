import { Router } from "express";
import {
  getResourcePurchases,
  createResourcePurchases,
  deleteResourcePurchases,
  getRsourcePurchasesById,
  verifyPayment,
} from "../controllers/resourcePurchases.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/admin.middleware";

const router = Router();

// user
router.post("/create/", authMiddleware, createResourcePurchases);
router.delete("/delete/:id", authMiddleware, deleteResourcePurchases);

// admin
router.patch("/verify/:id", authMiddleware, isAdmin, verifyPayment);
router.get("/", authMiddleware, isAdmin, getResourcePurchases);
router.get("/:id", authMiddleware, isAdmin, getRsourcePurchasesById);

export default router;
