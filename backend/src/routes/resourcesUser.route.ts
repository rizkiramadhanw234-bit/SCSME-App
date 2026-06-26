import { Router } from "express";
import {
  getIsPaidResourcesUser,
  downloadResources,
} from "../controllers/resourcesUser.controller";
import { authMiddleware, noAuth } from "../middleware/auth.middleware";

const router = Router();

// user
router.get("/public", noAuth, getIsPaidResourcesUser);
router.get("/isPaid/:userId", authMiddleware, getIsPaidResourcesUser);
router.get("/download/:id", authMiddleware, downloadResources);

export default router;
