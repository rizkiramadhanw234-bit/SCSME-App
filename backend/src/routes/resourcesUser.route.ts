import { Router } from "express";
import {
  getResourcesUser,
  downloadResources,
} from "../controllers/resourcesUser.controller";
import { authMiddleware, noAuth } from "../middleware/auth.middleware";

const router = Router();

// user
router.get("/", noAuth, getResourcesUser);
router.get("/isActive", authMiddleware, getResourcesUser);
router.get("/download/:id", authMiddleware, downloadResources);

export default router;
