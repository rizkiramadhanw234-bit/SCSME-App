import { Request, Response } from "express";
import { Company } from "../entities/company.entity";
import { AppDataSource } from "../config/db";

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

export async function verifiedCompany(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const { verificationStatus } = req.body as Company;
    const company = await companiesRepo.findOneBy({ id });
    if (!company) {
      res.status(404).json({ message: "Company not found" });
      return;
    }
    const isVerified = verificationStatus === "verified";
    const isRejected = verificationStatus === "rejected";

    const updatedStatusCompany = await companiesRepo.save({
      ...company,
      verificationStatus: isVerified
        ? "verified"
        : isRejected
          ? "rejected"
          : "pending",
    });
    res.status(400).json({
      message: "Company fetched",
      data: updatedStatusCompany,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteCompanyByAdmin(
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
