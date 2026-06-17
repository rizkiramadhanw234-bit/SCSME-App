import { Router } from "express";
import {
  getCompanies,
  getCompanyById,
  verifiedCompany,
  deleteCompanyByAdmin,
} from "../controllers/companyAdmin.controller";

const router = Router();

router.get("/", getCompanies);
router.get("/:id", getCompanyById);
router.put("/status/:id", verifiedCompany);
router.delete("/delete/:id", deleteCompanyByAdmin);

export default router;
