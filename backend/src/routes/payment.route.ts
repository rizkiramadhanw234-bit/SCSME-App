import { Router } from "express";
import {
  getPayments,
  createPayment,
  getPaymentById,
  deletePayment,
  getPaymentsByUserId,
} from "../controllers/payment.controller";
import { uploadProof } from "../lib/uploadProof";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// user
router.get("/", getPayments);
router.get("/:id", authMiddleware, getPaymentById);
router.get("/user/:userId", authMiddleware, getPaymentsByUserId);
router.post(
  "/create",
  authMiddleware,
  uploadProof.single("proofUrl"),
  createPayment,
);
router.delete("/delete/:id", authMiddleware, deletePayment);

export default router;
