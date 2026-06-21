import { Request, Response } from "express";
import { AppDataSource } from "../config/db";
import { PaidUpload } from "../entities/paid-upload.entity";
import { Like } from "typeorm";

const paidUploadsRepo = AppDataSource.getRepository(PaidUpload);

export async function getPaidUploads(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const getPaidUploads = await paidUploadsRepo.find();
    res
      .status(200)
      .json({ message: "Paid Uploads fetched", data: getPaidUploads });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getPaidUploadByStatus(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { status } = req.query as { status: string };
    const getPaidUploads = await paidUploadsRepo.find({
      where: {
        status: Like(`%${status}%`),
      },
    });
    if (!getPaidUploads) {
      res.status(404).json({ message: "Paid Uploads not found" });
      return;
    }
    res
      .status(200)
      .json({ message: "Paid Uploads status fetched", data: getPaidUploads });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function approvePaidUploads(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const { status, adminNotes } = req.body as {
      status: string;
      adminNotes: string;
    };
    const paidUpload = await paidUploadsRepo.findOneBy({ id });
    if (!paidUpload) {
      res.status(404).json({ message: "Paid Upload not found" });
      return;
    }
    const updatedPaidUpload = await paidUploadsRepo.save({
      ...paidUpload,
      status,
      adminNotes,
    });
    if (!updatedPaidUpload) {
      res.status(404).json({ message: "Failed to update paid upload" });
      return;
    }
    res.status(200).json({
      message: "Paid Upload updated approved",
      data: updatedPaidUpload,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function rejectedPaidUploads(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const { status, adminNotes } = req.body as {
      status: string;
      adminNotes: string;
    };
    const paidUpload = await paidUploadsRepo.findOneBy({ id });
    if (!paidUpload) {
      res.status(404).json({ message: "Paid Upload not found" });
      return;
    }
    const updatedPaidUpload = await paidUploadsRepo.save({
      ...paidUpload,
      status,
      adminNotes,
    });
    if (!updatedPaidUpload) {
      res.status(404).json({ message: "Failed to update paid upload" });
      return;
    }
    res.status(200).json({
      message: "Paid Upload updated rejected",
      data: updatedPaidUpload,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function revisionPaidUploads(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const { status, adminNotes } = req.body as {
      status: string;
      adminNotes: string;
    };
    const paidUpload = await paidUploadsRepo.findOneBy({ id });
    if (!paidUpload) {
      res.status(404).json({ message: "Paid Upload not found" });
      return;
    }
    const updatedPaidUpload = await paidUploadsRepo.save({
      ...paidUpload,
      status,
      adminNotes,
    });
    if (!updatedPaidUpload) {
      res
        .status(404)
        .json({ message: "Failed to update revision paid upload" });
      return;
    }
    res.status(200).json({
      message: "New revision for Paid Upload updated",
      data: updatedPaidUpload,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
