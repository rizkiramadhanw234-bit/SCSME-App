import { Router } from "express";
import {
  getResourcePurchases,
  createResourcePurchases,
  deleteResourcePurchases,
  getRsourcePurchasesById,
  verifyPayment,
} from "../controllers/resourcePurchases.controller";

const router = Router();

// user
router.post("/create/:id", createResourcePurchases);
router.delete("/delete/:id", deleteResourcePurchases);

// admin
router.patch("/verify/:id", verifyPayment);
router.get("/", getResourcePurchases);
router.get("/:id", getRsourcePurchasesById);

export default router;
