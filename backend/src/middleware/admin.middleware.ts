import { Request, Response, NextFunction } from "express";
import { Admin } from "../entities/admin.entity";
import { AppDataSource } from "../config/db";

export async function isAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const adminRepo = AppDataSource.getRepository(Admin);
    const { adminId } = req.user as { adminId: string };
    const admin = await adminRepo.findOneBy({ id: adminId });
    if (!admin) {
      res.status(404).json({ message: "Admin not found" });
      return;
    }
    if (admin.adminRole !== "super_admin") {
      res.status(403).json({ message: "Access denied" });
      return;
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
