import { Router } from "express";
import {
  getSubscriptions,
  getSubscriptionById,
  createSubscription,
  upgradeSubscription,
  deleteSubscription,
  verifyPaymentSubscription,
} from "../controllers/subscription.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/admin.middleware";

const router = Router();

// user
router.get("/", getSubscriptions);
router.get("/:id", authMiddleware, getSubscriptionById);
router.post("/create", authMiddleware, createSubscription);
router.put("/upgrade/:id", authMiddleware, upgradeSubscription);
router.delete("/delete/:id", authMiddleware, deleteSubscription);

// admin verify
router.patch("/verify/:id", authMiddleware, isAdmin, verifyPaymentSubscription);

export default router;
