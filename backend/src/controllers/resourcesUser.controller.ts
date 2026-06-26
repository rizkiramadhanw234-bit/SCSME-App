import { Request, Response } from "express";
import { Resource } from "../entities/resource.entity";
import { User } from "../entities/user.entity";
import { ResourcePurchases } from "../entities/resource-purchases.entity";
import { AppDataSource } from "../config/db";
import { In } from "typeorm";

const resourcesRepo = AppDataSource.getRepository(Resource);
const resourcePurchasesRepo = AppDataSource.getRepository(ResourcePurchases);
const userRepo = AppDataSource.getRepository(User);

export async function getIsPaidResourcesUser(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const userId = req.params.userId as string;
    const user = userId ? await userRepo.findOneBy({ id: userId }) : null;
    let accessLevel = ["public"];

    if (user) {
      const isPaid = await resourcePurchasesRepo.find({
        where: {
          userId: user.id,
          paymentStatus: "paid",
        },
      });
      if (!isPaid) {
        res.status(400).json({ message: "You are not a member" });
        return;
      }
      if (isPaid) {
        accessLevel = ["member", "public"];
      }

      const accessResources = isPaid.map((resource) => resource.resourceId);
      const resources = await resourcesRepo.find({
        where: [
          { accessLevel: In(accessLevel) },
          ...(accessResources.length > 0 ? [{ id: In(accessResources) }] : []),
        ],
      });
      res
        .status(200)
        .json({ message: "Paid Resources fetched", data: resources });
    }

    if (!user) {
      const resources = await resourcesRepo.find({
        where: { accessLevel: "public" },
      });
      res
        .status(200)
        .json({ message: "Resources fetched as public", data: resources });
    }
  } catch (error) {
    console.log(error);
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

    const purchased = await resourcePurchasesRepo.findOne({
      where: {
        resourceId: resource.id,
        paymentStatus: "paid",
      },
    });

    if (!purchased) {
      res.status(403).json({ message: "Access denied" });
      return;
    }
    res
      .status(200)
      .json({ message: "Resource fetched", data: resource.fileUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
