import { Router } from "express";
import {
  getRegistrations,
  deleteRegistration,
  createRegistration,
  getRegistrationById,
} from "../controllers/eventRegistration.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getRegistrations);
router.get("/:id", authMiddleware, getRegistrationById);
router.post("/create", authMiddleware, createRegistration);
router.delete("/delete/:id", authMiddleware, deleteRegistration);

export default router;
