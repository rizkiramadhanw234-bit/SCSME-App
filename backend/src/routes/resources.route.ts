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

const router = Router();

// admin
router.get("/", getResources);
router.get("/type/:type", getResourcesByType);
router.get("/:id", getResourceById);
router.get("/download/:id", downloadResources);
router.post("/create", uploadResources, createResource);
router.put("/update/:id", uploadResources, updateResource);
router.delete("/delete/:id", deleteResource);

export default router;
