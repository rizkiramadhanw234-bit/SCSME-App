import { Router } from "express";
import {
  getResourcePurchases,
  createResourcePurchases,
  deleteResourcePurchases,
  getRsourcePurchasesById,
  verifyPayment,
  downloadResources,
} from "../controllers/resourcePurchases.controller";

const router = Router();

// user
router.get("/", getResourcePurchases);
router.get("/:id", getRsourcePurchasesById);
router.get("/download/:id", downloadResources);
router.post("/create", createResourcePurchases);
router.delete("/delete/:id", deleteResourcePurchases);

// admin verify
router.patch("/verify/:id", verifyPayment);

export default router;
