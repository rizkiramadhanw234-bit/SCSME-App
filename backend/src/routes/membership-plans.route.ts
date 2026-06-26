import { Router } from "express";
import {
  getMembershipPlans,
  MembershipPlanIsActive,
  createMembershipPlan,
  getMembershipPlanById,
  updateMembershipPlan,
  deleteMembershipPlan,
} from "../controllers/membership-plans.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/admin.middleware";

const router = Router();

// admin
router.get("/", getMembershipPlans);
router.patch("/isActive/:id", authMiddleware, isAdmin, MembershipPlanIsActive);
router.get("/:id", authMiddleware, getMembershipPlanById);
router.post("/create", authMiddleware, isAdmin, createMembershipPlan);
router.put("/update/:id", authMiddleware, isAdmin, updateMembershipPlan);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteMembershipPlan);

export default router;
