import { Request, Response } from "express";
import { Company } from "../entities/company.entity";
import { AppDataSource } from "../config/db";
import { Like } from "typeorm/browser";

const companiesRepo = AppDataSource.getRepository(Company);

export async function getCompanies(req: Request, res: Response): Promise<void> {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const companies = await companiesRepo.find({
      take: limit,
      skip: offset,
    });
    res.status(200).json({
      message: "companies fetched",
      data: companies,
      meta: {
        total: companies.length,
        limit,
        offset,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getCompanyById(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const company = await companiesRepo.findOneBy({ id });
    if (!company) {
      res.status(404).json({ message: "Company not found" });
      return;
    }
    res.status(200).json({ message: "company fetched", data: company });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function searchCompanyByName(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { name } = req.query as { name: string };
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const companies = await companiesRepo.find({
      where: {
        companyName: Like(`%${name}%`),
      },
      take: limit,
      skip: offset,
    });
    res.status(200).json({
      message: "companies fetched",
      data: companies,
      meta: {
        total: companies.length,
        limit,
        offset,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createCompany(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { userId, companyName, categoryId, description, logoUrl, website } =
      req.body as Company;
    if (
      !userId ||
      !companyName ||
      !categoryId ||
      !description ||
      !logoUrl ||
      !website
    ) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }
    const companyExist = await companiesRepo.findOneBy({ companyName });
    if (companyExist) {
      res.status(400).json({ message: "Company already exists" });
    } else {
      const newCompany = await companiesRepo.save({
        userId,
        companyName,
        categoryId,
        description,
        logoUrl,
        website,
        verificationStatus: "pending",
      });
      res.status(201).json({ message: "Company created", data: newCompany });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateCompany(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const { companyName, categoryId, description, logoUrl, website } =
      req.body as Company;
    const company = await companiesRepo.findOneBy({ id });
    if (!company) {
      res.status(404).json({ message: "Company not found" });
      return;
    }
    if (
      companyName === company.companyName &&
      categoryId === company.categoryId &&
      description === company.description &&
      logoUrl === company.logoUrl &&
      website === company.website
    ) {
      res.status(400).json({ message: "No changes" });
      return;
    }
    const updatedCompany = await companiesRepo.update(
      { id },
      {
        companyName,
        categoryId,
        description,
        logoUrl,
        website,
      },
    );
    res.status(200).json({ message: "Company updated", data: updatedCompany });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteCompany(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const company = await companiesRepo.findOneBy({ id });
    if (!company) {
      res.status(404).json({ message: "Company not found" });
      return;
    }
    await companiesRepo.delete({ id });
    res.status(200).json({ message: "Company deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
