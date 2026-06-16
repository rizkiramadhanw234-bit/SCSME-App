import { Request, Response } from "express";
import { MembershipPlan } from "../entities/membership-plan.entity";
import { AppDataSource } from "../config/db";

const membershipPlansRepo = AppDataSource.getRepository(MembershipPlan);

export async function getMembershipPlans(req: Request, res: Response) {
  try {
    const membershipPlans = await membershipPlansRepo.find();
    res
      .status(200)
      .json({ message: "Membership plans fetched", data: membershipPlans });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function MembershipPlanIsActive(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const membershipPlan = await membershipPlansRepo.findOneBy({ id });
    if (!membershipPlan) {
      res.status(404).json({ message: "Membership plan not found" });
      return;
    }

    const isActive = !membershipPlan.isActive;
    membershipPlan.isActive = isActive;
    await membershipPlansRepo.update({ id }, membershipPlan);
    res
      .status(200)
      .json({ message: "Membership plan updated", data: membershipPlan });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getMembershipPlanById(req: Request, res: Response) {
  try {
    const { id } = req.params as { id: string };
    const membershipPlan = await membershipPlansRepo.findOneBy({ id });
    if (!membershipPlan) {
      res.status(404).json({ message: "Membership plan not found" });
      return;
    }
    if (!membershipPlan.isActive) {
      res.status(400).json({ message: "Membership plan is not active" });
      return;
    }
    res
      .status(200)
      .json({ message: "Membership plan fetched", data: membershipPlan });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createMembershipPlan(req: Request, res: Response) {
  try {
    const { planName, price, durationDays, benefits } =
      req.body as MembershipPlan;
    if (!planName || !price || !durationDays || !benefits) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }
    const existingMembershipPlan = await membershipPlansRepo.findOneBy({
      planName,
    });
    if (existingMembershipPlan) {
      res.status(400).json({ message: "Membership plan already exists" });
      return;
    }
    const newMembershipPlan = await membershipPlansRepo.save({
      planName,
      price,
      durationDays,
      benefits,
    });
    res.status(200).json({
      message: "Membership plan created",
      data: newMembershipPlan,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateMembershipPlan(req: Request, res: Response) {
  try {
    const { id } = req.params as { id: string };
    const { planName, price, durationDays, benefits } =
      req.body as MembershipPlan;
    const membershipPlan = await membershipPlansRepo.findOneBy({ id });
    if (!membershipPlan) {
      res.status(404).json({ message: "Membership plan not found" });
      return;
    }
    if (!planName && !price && !durationDays && !benefits) {
      res.status(400).json({ message: "At least one field is required" });
      return;
    }
    if (planName) {
      membershipPlan.planName = planName;
    }
    if (price) {
      membershipPlan.price = price;
    }
    if (durationDays) {
      membershipPlan.durationDays = durationDays;
    }
    if (benefits) {
      membershipPlan.benefits = benefits;
    }
    await membershipPlansRepo.update({ id }, membershipPlan);
    res.status(200).json({ message: "Membership plan updated" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteMembershipPlan(req: Request, res: Response) {
  try {
    const { id } = req.params as { id: string };
    await membershipPlansRepo.delete({ id });
    res.status(200).json({ message: "Membership plan deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
