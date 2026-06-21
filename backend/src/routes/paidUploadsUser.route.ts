import { Router } from "express";
import {
  getPaidUploadById,
  createPaidUpload,
  deletePaidUpload,
  updatePaidUploads,
} from "../controllers/paidUploadsUser.controller";
import { paidUploadUser } from "../lib/paiUploads";

const router = Router();

// user
router.post("/create", paidUploadUser.single("imageUrl"), createPaidUpload);
router.get("/:id", getPaidUploadById);
router.put("/update/:id", paidUploadUser.single("imageUrl"), updatePaidUploads);
router.delete("/delete/:id", deletePaidUpload);

export default router;
