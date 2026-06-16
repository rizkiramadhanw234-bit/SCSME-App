import { Router } from "express";
import {
  getSubscriptions,
  getSubscriptionById,
  createSubscription,
  upgradeSubscription,
  deleteSubscription,
} from "../controllers/subscription.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getSubscriptions);
router.get("/:id", authMiddleware, getSubscriptionById);
router.post("/create", authMiddleware, createSubscription);
router.put("/upgrade/:id", authMiddleware, upgradeSubscription);
router.delete("/delete/:id", authMiddleware, deleteSubscription);

export default router;
