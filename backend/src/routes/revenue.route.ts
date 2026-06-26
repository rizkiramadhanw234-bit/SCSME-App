import { Router } from "express";
import { getRevenueStats } from "../controllers/paymentAdminVerify.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/admin.middleware";

const router = Router();

// admin
router.get("/", authMiddleware, isAdmin, getRevenueStats);

export default router;
