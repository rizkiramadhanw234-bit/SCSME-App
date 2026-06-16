import { Admin } from "../entities/admin.entity";
import { Request, Response } from "express";
import { AppDataSource } from "../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const adminsRepo = AppDataSource.getRepository(Admin);

export async function getAdmins(req: Request, res: Response): Promise<void> {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const admins = await adminsRepo.find({
      where: { isActive: true },
      take: limit,
      skip: offset,
    });
    const adminNoPassword = admins.map((admin) => {
      const { passwordHash, ...adminNoPassword } = admin;
      return adminNoPassword;
    });
    res.json({
      message: "admin fetched",
      data: adminNoPassword,
      meta: {
        total: admins.length,
        limit,
        offset,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getAdminById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const admin = await adminsRepo.findOneBy({ id, isActive: true });
    if (!admin) {
      res.status(404).json({ message: "Admin not found" });
      return;
    }
    const { passwordHash, ...adminNoPassword } = admin;
    res.json({ message: "admin fetched", data: adminNoPassword });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getAdminByEmail(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { email } = req.query as { email: string };
    const admin = await adminsRepo.findOneBy({ email });
    if (!admin) {
      res.status(404).json({ message: "Admin not found" });
      return;
    }
    const { passwordHash, ...adminNoPassword } = admin;
    res.json({ message: "admin fetched", data: adminNoPassword });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createAdmin(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, passwordHash, adminRole } = req.body as Admin;
    if (!name || !email || !passwordHash || !adminRole) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: "Invalid email format" });
      return;
    }

    if (passwordHash.length < 8) {
      res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
      return;
    }

    const emailExists = await adminsRepo.findOneBy({ email });
    if (emailExists) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(passwordHash, 10);
    const newAdmin = await adminsRepo.save({
      name,
      email,
      passwordHash: hashedPassword,
      adminRole,
      isActive: true,
    });

    const { passwordHash: _, ...adminNoPassword } = newAdmin;
    res.json({ message: "admin created", data: adminNoPassword });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateAdmin(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const { name, email, passwordHash, adminRole } = req.body as Admin;
    const admin = await adminsRepo.findOneBy({ id });
    if (!admin) {
      res.status(404).json({ message: "Admin not found" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      res.status(400).json({ message: "Invalid email format" });
      return;
    }
    if (
      name === admin.name &&
      email === admin.email &&
      passwordHash === admin.passwordHash &&
      adminRole === admin.adminRole
    ) {
      res.status(400).json({ message: "No changes" });
      return;
    }
    if (name) {
      admin.name = name;
    }
    if (email) {
      admin.email = email;
    }
    let hashedPassword = admin.passwordHash;
    if (passwordHash) {
      hashedPassword = await bcrypt.hash(passwordHash, 10);
      admin.passwordHash = hashedPassword;
    }
    if (passwordHash.length < 8) {
      res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
      return;
    }
    if (adminRole) {
      admin.adminRole = adminRole;
    }
    await adminsRepo.save(admin);
    const { passwordHash: _, ...adminNoPassword } = admin;
    res.status(200).json({ message: "admin updated", data: adminNoPassword });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteAdmin(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    await adminsRepo.delete({ id });
    res.json({ message: "admin deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function loginAdmin(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    const admin = await adminsRepo.findOneBy({ email });
    if (!admin) {
      res.status(404).json({ message: "Admin not found" });
      return;
    }
    const isPasswordMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isPasswordMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
    const token = jwt.sign(
      { adminId: admin.id },
      process.env.JWT_SECRET as string,
    );
    res.json({ message: "admin logged in", token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function logoutAdmiin(req: Request, res: Response): Promise<void> {
  try {
    res.clearCookie("adminToken");
    res.json({ message: "admin logged out" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
