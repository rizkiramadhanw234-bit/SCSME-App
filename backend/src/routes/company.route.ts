import { Router } from "express";
import {
  getCompanies,
  getCompanyById,
  searchCompanyByName,
  createCompany,
  updateCompany,
  deleteCompany,
} from "../controllers/company.controller";
import { logoUpload } from "../lib/logoUpload";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// user
router.get("/", getCompanies);
router.get("/search", authMiddleware, searchCompanyByName);
router.get("/:id", authMiddleware, getCompanyById);
router.post(
  "/create",
  logoUpload.single("logoUrl"),
  authMiddleware,
  createCompany,
);
router.put("/update/:id", authMiddleware, updateCompany);
router.delete("/delete/:id", authMiddleware, deleteCompany);

export default router;
