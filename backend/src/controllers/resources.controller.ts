import { Resource } from "../entities/resource.entity";
import { AppDataSource } from "../config/db";
import { Request, Response } from "express";

const resourcesRepo = AppDataSource.getRepository(Resource);

export async function getResources(req: Request, res: Response): Promise<void> {
  try {
    const getResources = await resourcesRepo.find();
    res.status(200).json({ message: "Resources fetched", data: getResources });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getResourceById(req: Request, res: Response) {
  try {
    const { id } = req.params as { id: string };
    const getResource = await resourcesRepo.findOneBy({ id });
    if (!getResource) {
      res.status(404).json({ message: "Resource not found" });
      return;
    }
    res.status(200).json({ message: "Resource fetched", data: getResource });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getResourcesByType(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { type } = req.params as { type: string };
    const getResources = await resourcesRepo.findBy({ type });
    res.status(200).json({ message: "Resources fetched", data: getResources });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createResource(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { title, type, accessLevel, price, seoTitle, metaDescription } =
      req.body as Resource;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const fileUrl = files.fileUrl[0].filename;
    const coverImage = files.coverImage[0].filename;

    const resourceExist = await resourcesRepo.findOneBy({ title });
    if (resourceExist) {
      res.status(400).json({ message: "Resource already exists" });
      return;
    }
    if (!title) {
      res.status(400).json({ message: "Title is required" });
      return;
    }
    const newResource = await resourcesRepo.save({
      title,
      type,
      accessLevel,
      price,
      fileUrl: `${process.env.BASE_URL}/public/files/${fileUrl}`,
      coverImage: `${process.env.BASE_URL}/public/coverImage/${coverImage}`,
      seoTitle,
      metaDescription,
    });
    res.status(200).json({ message: "Resource created", data: newResource });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateResource(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const { title, type, accessLevel, price, seoTitle, metaDescription } =
      req.body as Resource;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const fileUrl = files.fileUrl[0].filename;
    const coverImage = files.coverImage[0].filename;

    const resourceExist = await resourcesRepo.findOneBy({ id });
    if (!resourceExist) {
      res.status(404).json({ message: "Resource not found" });
      return;
    }
    if (
      title === resourceExist.title &&
      type === resourceExist.type &&
      accessLevel === resourceExist.accessLevel &&
      price === resourceExist.price &&
      fileUrl === resourceExist?.fileUrl &&
      coverImage === resourceExist?.coverImage &&
      seoTitle === resourceExist.seoTitle &&
      metaDescription === resourceExist.metaDescription
    ) {
      res.status(400).json({ message: "No changes" });
      return;
    }
    const updatedResource = await resourcesRepo.save({
      ...resourceExist,
      title,
      type,
      accessLevel,
      price,
      fileUrl: `${process.env.BASE_URL}/public/files/${fileUrl}`,
      coverImage: `${process.env.BASE_URL}/public/coverImage/${coverImage}`,
      seoTitle,
      metaDescription,
    });
    res
      .status(200)
      .json({ message: "Resource updated", data: updatedResource });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteResource(
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
    await resourcesRepo.delete({ id });
    res.status(200).json({ message: "Resource deleted" });
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
