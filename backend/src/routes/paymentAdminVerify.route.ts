import { Router } from "express";
import {
  getPayments,
  deletePayment,
  getPaymentById,
  getPendingPaymentStatus,
  updatePaymentStatus,
} from "../controllers/paymentAdminVerify.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getPayments);
router.get("/pending", authMiddleware, getPendingPaymentStatus);
router.get("/:id", authMiddleware, getPaymentById);
router.patch("/verify/:id", authMiddleware, updatePaymentStatus);
router.delete("/delete/:id", authMiddleware, deletePayment);

export default router;
