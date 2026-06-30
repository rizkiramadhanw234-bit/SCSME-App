import { Request, Response } from "express";
import { AppDataSource } from "../config/db";
import { EventRegistration } from "../entities/event-registration.entity";
import { Subscription } from "../entities/subscription.entity";
import { ResourcePurchases } from "../entities/resource-purchases.entity";
import { PaidUpload } from "../entities/paid-upload.entity";

const eventRegistrationsRepo = AppDataSource.getRepository(EventRegistration);
const subscriptionsRepo = AppDataSource.getRepository(Subscription);
const resourcePurchasesRepo = AppDataSource.getRepository(ResourcePurchases);
const paidUploadsRepo = AppDataSource.getRepository(PaidUpload);

export async function getPendingEventOrder(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { userId } = req.params as { userId: string };
    const pendingEventOrder = await eventRegistrationsRepo.find({
      where: { userId, paymentStatus: "pending" },
      relations: { event: true },
    });
    if (!pendingEventOrder) {
      res.status(404).json({ message: "Pending event order not found" });
      return;
    }
    res.status(200).json({
      message: "Pending event order fetched",
      data: pendingEventOrder,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getPendingSubsOrder(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { userId } = req.params as { userId: string };
    const pendingSubsOrder = await subscriptionsRepo.find({
      where: { userId, paymentStatus: "pending" },
      relations: { plan: true },
    });
    if (!pendingSubsOrder) {
      res.status(404).json({ message: "Pending subscription order not found" });
      return;
    }
    res.status(200).json({
      message: "Pending subscription order fetched",
      data: pendingSubsOrder,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getPendingResourceOrder(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { userId } = req.params as { userId: string };
    const pendingResourceOrder = await resourcePurchasesRepo.find({
      where: { userId, paymentStatus: "pending" },
      relations: { resource: true },
    });
    if (!pendingResourceOrder) {
      res.status(404).json({ message: "Pending resource order not found" });
      return;
    }
    res.status(200).json({
      message: "Pending resource order fetched",
      data: pendingResourceOrder,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getPendingPaidUploadOrder(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { userId } = req.params as { userId: string };
    const pendingPaidUploadOrder = await paidUploadsRepo.find({
      where: { userId, paymentStatus: "pending" },
      relations: { company: true },
    });
    if (!pendingPaidUploadOrder) {
      res.status(404).json({ message: "Pending paid upload order not found" });
      return;
    }
    res.status(200).json({
      message: "Pending paid upload order fetched",
      data: pendingPaidUploadOrder,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
