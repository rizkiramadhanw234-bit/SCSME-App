import { Router } from "express";
import {
  getCompanies,
  getCompanyById,
  verifiedCompany,
  deleteCompanyByAdmin,
} from "../controllers/companyAdmin.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/admin.middleware";

const router = Router();

// admin
router.get("/", getCompanies);
router.get("/:id", authMiddleware, isAdmin, getCompanyById);
router.patch("/status/:id", authMiddleware, isAdmin, verifiedCompany);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteCompanyByAdmin);

export default router;
