import { Router } from "express";
import {
  getPaidUploadById,
  createPaidUpload,
  deletePaidUpload,
  updatePaidUploads,
  getPaidUploadByUserId,
} from "../controllers/paidUploadsUser.controller";
import { paidUploadUser } from "../lib/paiUploads";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// user
router.post(
  "/create",
  paidUploadUser.single("imageUrl"),
  authMiddleware,
  createPaidUpload,
);
router.get("/user/:userId", authMiddleware, getPaidUploadByUserId);
router.get("/:id", authMiddleware, getPaidUploadById);
router.put(
  "/update/:id",
  paidUploadUser.single("imageUrl"),
  authMiddleware,
  updatePaidUploads,
);
router.delete("/delete/:id", authMiddleware, deletePaidUpload);

export default router;
