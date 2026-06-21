import { Request, Response } from "express";
import { AppDataSource } from "../config/db";
import { ResourcePurchases } from "../entities/resource-purchases.entity";
import { Resource } from "../entities/resource.entity";

const resourcePurchasesRepo = AppDataSource.getRepository(ResourcePurchases);
const resourcesRepo = AppDataSource.getRepository(Resource);

export async function getResourcePurchases(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const resourcePurchases = await resourcePurchasesRepo.find();
    res
      .status(200)
      .json({ message: "Resource Purchases fetched", data: resourcePurchases });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getRsourcePurchasesById(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const resourcePurchases = await resourcePurchasesRepo.findOneBy({ id });
    if (!resourcePurchases) {
      res.status(404).json({ message: "Resource Purchases not found" });
      return;
    }
    res
      .status(200)
      .json({ message: "Resource Purchases fetched", data: resourcePurchases });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createResourcePurchases(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { resourceId, userId } = req.body as ResourcePurchases;
    const resource = await resourcesRepo.findOneBy({ id: resourceId });
    const alreadyPurchased = await resourcePurchasesRepo.findOneBy({
      userId,
      resourceId,
    });
    if (!resource) {
      res.status(404).json({ message: "Resource not found" });
      return;
    }
    if (alreadyPurchased) {
      res.status(404).json({ message: "Already Purchased" });
      return;
    }
    const newResourcePurchases = await resourcePurchasesRepo.save({
      resourceId,
      userId,
      paymentStatus: "pending",
    });
    res.status(200).json({
      message: "Resource Purchases created",
      data: newResourcePurchases,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteResourcePurchases(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const resourcePurchases = await resourcePurchasesRepo.findOneBy({ id });
    if (!resourcePurchases) {
      res.status(404).json({ message: "Resource Purchases not found" });
      return;
    }
    await resourcePurchasesRepo.delete({ id });
    res.status(200).json({ message: "Resource Purchases deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function verifyPayment(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const { paymentStatus } = req.body as ResourcePurchases;
    const resourcePurchases = await resourcePurchasesRepo.findOneBy({ id });
    if (!resourcePurchases) {
      res.status(404).json({ message: "Resource Purchases not found" });
      return;
    }
    const isPaid = paymentStatus === "paid";
    const isFailed = paymentStatus === "failed";
    const isRefunded = paymentStatus === "refunded";
    const updatedPaymentStatus = await resourcePurchasesRepo.save({
      ...resourcePurchases,
      paymentStatus: isPaid
        ? "paid"
        : isFailed
          ? "failed"
          : isRefunded
            ? "refunded"
            : "pending",
    });
    res
      .status(200)
      .json({ message: "Payment verified", data: updatedPaymentStatus });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function downloadResources(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const resource = await resourcesRepo.findOneBy({ id });
    if (!resource) {
      res.status(404).json({ message: "Resource not found" });
      return;
    }
    res
      .status(200)
      .json({ message: "Resource fetched", data: resource.fileUrl });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
