import { Router } from "express";
import {
  getPaidUploads,
  approvePaidUploads,
  getPaidUploadByStatus,
  rejectedPaidUploads,
  revisionPaidUploads,
} from "../controllers/paidUploadsAdmin.controller";

const router = Router();

// admin
router.get("/", getPaidUploads);
router.get("/status", getPaidUploadByStatus);
router.patch("/approve/:id", approvePaidUploads);
router.patch("/rejected/:id", rejectedPaidUploads);
router.patch("/revision/:id", revisionPaidUploads);

export default router;
