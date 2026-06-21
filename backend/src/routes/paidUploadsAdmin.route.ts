import { Router } from "express";
import {
  getPaidUploads,
  approvePaidUploads,
  getPaidUploadByStatus,
  rejectedPaidUploads,
  revisionPaidUploads,
} from "../controllers/paidUploadsAdmin.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/admin.middleware";

const router = Router();

// admin
router.get("/", getPaidUploads);
router.get("/status", authMiddleware, isAdmin, getPaidUploadByStatus);
router.patch("/approve/:id", authMiddleware, isAdmin, approvePaidUploads);
router.patch("/rejected/:id", authMiddleware, isAdmin, rejectedPaidUploads);
router.patch("/revision/:id", authMiddleware, isAdmin, revisionPaidUploads);

export default router;
