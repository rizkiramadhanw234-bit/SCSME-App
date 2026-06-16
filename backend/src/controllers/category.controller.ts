import { Category } from "../entities/category.entity";
import { Request, Response } from "express";
import { AppDataSource } from "../config/db";

const categoriesRepo = AppDataSource.getRepository(Category);

export async function getCategories(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const categories = await categoriesRepo.find();
    res.status(200).json({ message: "categories fetched", data: categories });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getCategoryById(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const category = await categoriesRepo.findOneBy({ id });
    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }
    res.status(200).json({ message: "category fetched", data: category });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createCategory(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { name } = req.body as { name: string };
    const categoryExist = await categoriesRepo.findOneBy({ name });
    if (categoryExist) {
      res.status(400).json({ message: "Category already exists" });
    } else {
      const newCategory = await categoriesRepo.save({ name });
      res.status(200).json({ message: "Category created", data: newCategory });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateCategory(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const { name } = req.body as { name: string };
    const category = await categoriesRepo.findOneBy({ id });
    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }
    if (name) {
      category.name = name;
    }
    await categoriesRepo.save(category);
    res.status(200).json({ message: "Category updated", data: category });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteCategory(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    await categoriesRepo.delete({ id });
    res.status(200).json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
