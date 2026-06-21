import { Router } from "express";
import {
  getCompanies,
  getCompanyById,
  verifiedCompany,
  deleteCompanyByAdmin,
} from "../controllers/companyAdmin.controller";

const router = Router();

// admin
router.get("/", getCompanies);
router.get("/:id", getCompanyById);
router.patch("/status/:id", verifiedCompany);
router.delete("/delete/:id", deleteCompanyByAdmin);

export default router;
