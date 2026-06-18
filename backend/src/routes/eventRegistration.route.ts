import { Router } from "express";
import {
  getRegistrations,
  cancelRegistration,
  createRegistration,
  getRegistrationById,
} from "../controllers/eventRegistration.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getRegistrations);
router.get("/:id", authMiddleware, getRegistrationById);
router.post("/create", authMiddleware, createRegistration);
router.put("/cancel/:id", authMiddleware, cancelRegistration);

export default router;
