import { Router } from "express";
import {
  getCompanies,
  getCompanyById,
  searchCompanyByName,
  createCompany,
  updateCompany,
  deleteCompany,
  getCompanyByUserId,
} from "../controllers/company.controller";
import { logoUpload } from "../lib/logoUpload";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// user
router.get("/:userId", getCompanyByUserId);
router.get("/search", authMiddleware, searchCompanyByName);
router.get("/:id", authMiddleware, getCompanyById);
router.post(
  "/create",
  authMiddleware,
  logoUpload.single("logoUrl"),
  createCompany,
);
router.put(
  "/update/:id",

  authMiddleware,
  logoUpload.single("logoUrl"),
  updateCompany,
);
router.delete("/delete/:id", authMiddleware, deleteCompany);

export default router;
