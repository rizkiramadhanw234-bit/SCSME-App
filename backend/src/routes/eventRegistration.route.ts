import { Router } from "express";
import {
  getRegistrations,
  deleteRegistration,
  createRegistration,
  getRegistrationById,
  verifyPaymentEventRegistration,
  getQrCodeEventRegistration,
  getEventRegistrationByUserId,
} from "../controllers/eventRegistration.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/admin.middleware";

const router = Router();

// user
router.get("/", getRegistrations);
router.get("/user/:userId", authMiddleware, getEventRegistrationByUserId);
router.get("/:id", authMiddleware, getRegistrationById);
router.get("/qrcode/:id", authMiddleware, getQrCodeEventRegistration);
router.post("/create", authMiddleware, createRegistration);
router.delete("/delete/:id", authMiddleware, deleteRegistration);

// admin
router.patch(
  "/verify/:id",
  authMiddleware,
  isAdmin,
  verifyPaymentEventRegistration,
);

export default router;
