import { Router } from "express";
import {
  getEvents,
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
  updateStatus,
} from "../controllers/events.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/admin.middleware";

const router = Router();

//admin
router.get("/", getEvents);
router.get("/:id", authMiddleware, getEventById);
router.post("/create", authMiddleware, isAdmin, createEvent);
router.put("/update/:id", authMiddleware, isAdmin, updateEvent);
router.patch("/status/:id", authMiddleware, isAdmin, updateStatus);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteEvent);

export default router;
