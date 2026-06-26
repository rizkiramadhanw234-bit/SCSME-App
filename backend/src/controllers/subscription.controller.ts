import { Request, Response } from "express";
import { Subscription } from "../entities/subscription.entity";
import { MembershipPlan } from "../entities/membership-plan.entity";
import { AppDataSource } from "../config/db";

const subscriptionsRepo = AppDataSource.getRepository(Subscription);
const membershipPlansRepo = AppDataSource.getRepository(MembershipPlan);

export async function getSubscriptions(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const getSubscriptions = await subscriptionsRepo.find();
    const today = new Date();
    const expiredSubscriptions = getSubscriptions.filter(
      (expSub: Subscription) => {
        return new Date(expSub.endDate) < today;
      },
    );
    if (expiredSubscriptions.length > 0) {
      res.status(400).json({ message: "Some subscriptions are expired" });
    }
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

    const today = new Date();
    const isExpired = new Date(getSubscription.endDate) < today;
    if (isExpired) {
      res.status(400).json({ message: "Subscription is expired" });
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

export async function getSubscriptionByUserId(req: Request, res: Response) {
  try {
    const { userId } = req.params as { userId: string };
    const getSubscription = await subscriptionsRepo.findOneBy({ userId });
    if (!getSubscription) {
      res.status(404).json({ message: "Subscription not found" });
      return;
    }
    const today = new Date();
    const isExpired = new Date(getSubscription.endDate) < today;
    if (isExpired) {
      res.status(400).json({ message: "Subscription is expired" });
      return;
    }
    res
      .status(200)
      .json({ message: "Subscription fetched", data: getSubscription });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createSubscription(req: Request, res: Response) {
  try {
    const { userId, planId, renewalStatus } = req.body as Subscription;
    const membershipPlan = await membershipPlansRepo.findOneBy({ id: planId });
    if (!membershipPlan) {
      res.status(404).json({ message: "Membership plan not found" });
      return;
    }
    if (!membershipPlan?.isActive) {
      res.status(400).json({ message: "Membership plan is not active" });
      return;
    }
    const alreadySubscribed = await subscriptionsRepo.findOneBy({ userId });
    if (alreadySubscribed) {
      res.status(400).json({ message: "User already has a subscription" });
      return;
    }
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1);
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
    const { userId, planId, startDate, renewalStatus } =
      req.body as Subscription;
    const currentSubscription = await subscriptionsRepo.findOneBy({ id });
    if (!currentSubscription) {
      res.status(404).json({ message: "Subscription not found or expired" });
      return;
    }
    const membershipPlan = await membershipPlansRepo.findOneBy({ id: planId });
    if (!membershipPlan) {
      res.status(404).json({ message: "Membership plan not found" });
      return;
    }
    if (!membershipPlan?.isActive) {
      res.status(400).json({ message: "Membership plan is not active" });
      return;
    }
    const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    const upgradedSubscription = await subscriptionsRepo.save({
      ...currentSubscription,
      userId,
      planId,
      startDate,
      endDate,
      paymentStatus: "pending",
      renewalStatus,
    });
    res
      .status(200)
      .json({ message: "Subscription updated", data: upgradedSubscription });
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

export async function verifyPaymentSubscription(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const { paymentStatus } = req.body as Subscription;
    const subscription = await subscriptionsRepo.findOneBy({ id });
    if (!subscription) {
      res.status(404).json({ message: "Subscription not found" });
      return;
    }
    const isPaid = paymentStatus === "paid";
    const isFfailed = paymentStatus === "failed";
    const updatedSubscription = await subscriptionsRepo.save({
      ...subscription,
      paymentStatus: isPaid ? "paid" : isFfailed ? "failed" : "pending",
    });
    res
      .status(200)
      .json({ message: "Subscription verified", data: updatedSubscription });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
