import { Router } from "express";
import {
  getPayments,
  deletePayment,
  getPaymentById,
  getPendingPaymentStatus,
  updatePaymentStatus,
} from "../controllers/paymentAdminVerify.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/admin.middleware";

const router = Router();

// admin
router.get("/", getPayments);
router.get("/pending", authMiddleware, isAdmin, getPendingPaymentStatus);
router.get("/:id", authMiddleware, isAdmin, getPaymentById);
router.patch("/verify/:id", authMiddleware, isAdmin, updatePaymentStatus);
router.delete("/delete/:id", authMiddleware, isAdmin, deletePayment);

export default router;
