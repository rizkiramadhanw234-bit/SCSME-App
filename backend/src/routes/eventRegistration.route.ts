import { Router } from "express";
import {
  getRegistrations,
  deleteRegistration,
  createRegistration,
  getRegistrationById,
  verifyPaymentEventRegistration,
  getQrCodeEventRegistration,
} from "../controllers/eventRegistration.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// user
router.get("/", getRegistrations);
router.get("/:id", authMiddleware, getRegistrationById);
router.get("/qrcode/:id", authMiddleware, getQrCodeEventRegistration);
router.post("/create", authMiddleware, createRegistration);
router.delete("/delete/:id", authMiddleware, deleteRegistration);

// admin
router.patch("/verify/:id", authMiddleware, verifyPaymentEventRegistration);

export default router;
