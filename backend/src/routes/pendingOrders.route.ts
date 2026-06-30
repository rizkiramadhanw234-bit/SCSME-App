import { Router } from "express";
import {
  getPendingEventOrder,
  getPendingPaidUploadOrder,
  getPendingResourceOrder,
  getPendingSubsOrder,
} from "../controllers/pendingOrder.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/event/:userId", authMiddleware, getPendingEventOrder);
router.get("/resource/:userId", authMiddleware, getPendingResourceOrder);
router.get("/upload/:userId", authMiddleware, getPendingPaidUploadOrder);
router.get("/subscription/:userId", authMiddleware, getPendingSubsOrder);

export default router;
