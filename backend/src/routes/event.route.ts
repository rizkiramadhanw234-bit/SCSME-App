import { Router } from "express";
import {
  getEvents,
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/events.controller";

const router = Router();

//admin
router.get("/", getEvents);
router.get("/:id", getEventById);
router.post("/create", createEvent);
router.put("/update/:id", updateEvent);
router.delete("/delete/:id", deleteEvent);

export default router;
