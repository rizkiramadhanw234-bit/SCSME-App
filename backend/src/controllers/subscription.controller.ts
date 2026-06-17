import { Request, Response } from "express";
import { Subscription } from "../entities/subscription.entity";
import { MembershipPlan } from "../entities/membership-plan.entity";
import { AppDataSource } from "../config/db";

const subscriptionsRepo = AppDataSource.getRepository(Subscription);

export async function getSubscriptions(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const getSubscriptions = await subscriptionsRepo.find();
    res
      .status(200)
      .json({ message: "Subscriptions fetched", data: getSubscriptions });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getSubscriptionById(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const getSubscription = await subscriptionsRepo.findOneBy({ id });
    if (!getSubscription) {
      res.status(404).json({ message: "Subscription not found" });
      return;
    }
    res
      .status(200)
      .json({ message: "Subscription fetched", data: getSubscription });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createSubscription(req: Request, res: Response) {
  try {
    const { userId, planId, startDate, endDate, renewalStatus } =
      req.body as Subscription;
    const membershipPlansRepo = AppDataSource.getRepository(MembershipPlan);
    const membershipPlan = await membershipPlansRepo.findOneBy({ id: planId });
    if (!membershipPlan) {
      res.status(404).json({ message: "Membership plan not found" });
      return;
    }
    if (!membershipPlan?.isActive) {
      res.status(400).json({ message: "Membership plan is not active" });
      return;
    }
    const newSubscription = await subscriptionsRepo.save({
      userId,
      planId,
      startDate,
      endDate,
      paymentStatus: "pending",
      renewalStatus,
    });

    res
      .status(201)
      .json({ message: "Subscription created", data: newSubscription });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function upgradeSubscription(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const { userId, planId, startDate, endDate, renewalStatus } =
      req.body as Subscription;
    const currentSubscription = await subscriptionsRepo.findOneBy({ id });
    if (!currentSubscription) {
      res.status(404).json({ message: "Subscription not found or expired" });
      return;
    }
    const membershipPlansRepo = AppDataSource.getRepository(MembershipPlan);
    const membershipPlan = await membershipPlansRepo.findOneBy({ id: planId });
    if (!membershipPlan) {
      res.status(404).json({ message: "Membership plan not found" });
      return;
    }
    if (!membershipPlan?.isActive) {
      res.status(400).json({ message: "Membership plan is not active" });
      return;
    }
    await subscriptionsRepo.update(
      { id },
      {
        userId,
        planId,
        startDate,
        endDate,
        paymentStatus: "pending",
        renewalStatus,
      },
    );
    const updatedSubscription = await subscriptionsRepo.findOneBy({ id });
    res
      .status(200)
      .json({ message: "Subscription updated", data: updatedSubscription });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteSubscription(req: Request, res: Response) {
  try {
    const { id } = req.params as { id: string };
    await subscriptionsRepo.delete({ id });
    res.status(200).json({ message: "Subscription deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
