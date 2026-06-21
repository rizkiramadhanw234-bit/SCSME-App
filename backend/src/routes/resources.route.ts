import { Router } from "express";
import {
  getResources,
  createResource,
  deleteResource,
  getResourcesByType,
  getResourceById,
  updateResource,
  downloadResources,
} from "../controllers/resources.controller";
import { uploadResources } from "../helper/uploadResources";
import { authMiddleware } from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/admin.middleware";

const router = Router();

// admin
router.get("/", getResources);
router.get("/type/:type", authMiddleware, isAdmin, getResourcesByType);
router.get("/:id", authMiddleware, isAdmin, getResourceById);
router.get("/download/:id", authMiddleware, isAdmin, downloadResources);
router.post(
  "/create",
  authMiddleware,
  isAdmin,
  uploadResources,
  createResource,
);
router.put(
  "/update/:id",
  authMiddleware,
  isAdmin,
  uploadResources,
  updateResource,
);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteResource);

export default router;
