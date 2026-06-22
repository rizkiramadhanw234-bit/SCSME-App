import { Request, Response } from "express";
import { AppDataSource } from "../config/db";
import { AdPlacement } from "../entities/ad-placement.entity";

const adPlacementsRepo = AppDataSource.getRepository(AdPlacement);

export async function getAdPlacements(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const getAdPlacements = await adPlacementsRepo.find();
    res
      .status(200)
      .json({ message: "Ad Placements fetched", data: getAdPlacements });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getAdPlacementById(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const getAdPlacement = await adPlacementsRepo.findOneBy({ id });
    if (!getAdPlacement) {
      res.status(404).json({ message: "Ad Placement not found" });
      return;
    }
    res
      .status(200)
      .json({ message: "Ad Placement fetched", data: getAdPlacement });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createAdPlacement(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const {
      paidUpload_id,
      page,
      position,
      impressions,
      clicks,
      publishedAt,
      expiresAt,
    } = req.body as AdPlacement;
    const adPlacementExist = await adPlacementsRepo.findOneBy({
      paidUpload_id,
    });
    if (adPlacementExist) {
      res.status(400).json({ message: "Ad Placement already exists" });
      return;
    }
    if (!paidUpload_id) {
      res.status(400).json({ message: "Paid Upload ID is required" });
      return;
    }
    const newAdPlacement = await adPlacementsRepo.save({
      paidUpload_id,
      page,
      position,
      impressions,
      clicks,
      publishedAt,
      expiresAt,
    });
    res.status(201).json({
      message: "Ad Placement created",
      data: newAdPlacement,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateAdPlacement(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const {
      paidUpload_id,
      page,
      position,
      impressions,
      clicks,
      publishedAt,
      expiresAt,
    } = req.body as AdPlacement;
    const currentAdPlacements = await adPlacementsRepo.findOneBy({ id });
    if (!currentAdPlacements) {
      res.status(404).json({ message: "Ad Placement not found" });
      return;
    }
    const updatedAdPlacements = await adPlacementsRepo.save({
      ...currentAdPlacements,
      paidUpload_id,
      page,
      position,
      impressions,
      clicks,
      publishedAt,
      expiresAt,
    });
    res.status(200).json({
      message: "Ad Placement updated",
      data: updatedAdPlacements,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteAdPlacements(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const adPlacements = await adPlacementsRepo.delete({ id });
    if (!adPlacements) {
      res.status(404).json({ message: "Ad Placement not found" });
      return;
    }
    res.status(200).json({ message: "Ad Placement deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
