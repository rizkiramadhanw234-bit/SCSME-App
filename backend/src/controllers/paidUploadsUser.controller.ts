import { Request, Response } from "express";
import { AppDataSource } from "../config/db";
import { PaidUpload } from "../entities/paid-upload.entity";

const paidUploadsRepo = AppDataSource.getRepository(PaidUpload);

export async function getPaidUploadById(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const getPaidUpload = await paidUploadsRepo.findOneBy({ id });
    if (!getPaidUpload) {
      res.status(404).json({ message: "Paid Upload not found" });
      return;
    }
    res
      .status(200)
      .json({ message: "Paid Upload fetched", data: getPaidUpload });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createPaidUpload(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const {
      userId,
      companyId,
      uploadType,
      title,
      description,
      targetUrl,
      placement,
      price,
      seoTitle,
      metaDescription,
      altText,
    } = req.body as PaidUpload;
    const imageUrl = req.file as Express.Multer.File;
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);

    if (!userId || !companyId) {
      res.status(400).json({ message: "User ID and Company ID are required" });
      return;
    }
    if (!imageUrl) {
      res.status(400).json({ message: "Image file is required" });
      return;
    }
    const alreadyPaidUpload = await paidUploadsRepo.findOneBy({ userId });
    if (alreadyPaidUpload) {
      res.status(400).json({ message: "User already has a paid upload" });
      return;
    }

    const paidUpload = await paidUploadsRepo.save({
      userId,
      companyId,
      uploadType,
      title,
      description,
      imageUrl: `${process.env.BASE_URL}/public/paidUploads/${imageUrl.filename}`,
      targetUrl,
      placement,
      price,
      startDate,
      endDate,
      seoTitle,
      metaDescription,
      altText,
    });
    res.status(201).json({ message: "Paid Upload created", data: paidUpload });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updatePaidUploads(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const {
      companyId,
      uploadType,
      title,
      description,
      targetUrl,
      placement,
      price,
      seoTitle,
      metaDescription,
      altText,
    } = req.body as PaidUpload;
    const imageUrl = req.file as Express.Multer.File;
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);

    const paidUploadExist = await paidUploadsRepo.findOneBy({ id });
    if (!paidUploadExist) {
      res.status(404).json({ message: "Paid Upload not found" });
      return;
    }
    if (
      companyId === paidUploadExist.companyId &&
      uploadType === paidUploadExist.uploadType &&
      title === paidUploadExist.title &&
      description === paidUploadExist.description &&
      targetUrl === paidUploadExist.targetUrl &&
      placement === paidUploadExist.placement
    ) {
      res.status(400).json({ message: "no changes" });
    }
    const updatedPaidUpload = await paidUploadsRepo.save({
      ...paidUploadExist,
      companyId,
      uploadType,
      title,
      description,
      imageUrl: `${process.env.BASE_URL}/public/paidUploads/${imageUrl.filename}`,
      targetUrl,
      placement,
      price,
      startDate,
      endDate,
      seoTitle,
      metaDescription,
      altText,
    });
    res
      .status(200)
      .json({ message: "Paid Upload updated", data: updatedPaidUpload });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deletePaidUpload(req: Request, res: Response) {
  try {
    const { id } = req.params as { id: string };
    await paidUploadsRepo.delete({ id });
    res.status(200).json({ message: "Paid Upload deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
