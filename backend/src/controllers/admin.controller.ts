import { Admin } from "../entities/admin.entity";
import { Request, Response } from "express";
import { AppDataSource } from "../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { StringValue } from "ms";

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
      const { password, ...adminNoPassword } = admin;
      return adminNoPassword;
    });
    res.status(200).json({
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
    const admin = await adminsRepo.findOneBy({
      id: id,
      isActive: true as boolean,
    });
    if (!admin) {
      res.status(404).json({ message: "Admin not found" });
      return;
    }
    const { password, ...adminNoPassword } = admin;
    res.status(200).json({ message: "admin fetched", data: adminNoPassword });
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
    const { password, ...adminNoPassword } = admin;
    res.status(200).json({ message: "admin fetched", data: adminNoPassword });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createAdmin(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password, adminRole } = req.body as Admin;
    if (!name || !email || !password || !adminRole) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: "Invalid email format" });
      return;
    }

    if (password.length < 8) {
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

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await adminsRepo.save({
      name,
      email,
      password: hashedPassword,
      adminRole,
      isActive: true,
    });

    const { password: _, ...adminNoPassword } = newAdmin;
    res.status(201).json({ message: "admin created", data: adminNoPassword });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateAdmin(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const { name, email, password, adminRole } = req.body as Admin;
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
      password === admin.password &&
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
    let hashedPassword = admin.password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
      admin.password = hashedPassword;
    }
    if (password.length < 8) {
      res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
      return;
    }
    if (adminRole) {
      admin.adminRole = adminRole;
    }

    await adminsRepo.update({ id }, admin);
    res.status(200).json({ message: "admin updated" });
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
    const { email, password } = req.body as { email: string; password: string };
    const admin = await adminsRepo.findOneBy({ email });
    if (!admin) {
      res.status(404).json({ message: "Admin not found" });
      return;
    }
    const isPasswordMatch = await bcrypt.compare(password, admin.password);
    if (!isPasswordMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const accessToken = jwt.sign(
      { adminId: admin.id },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN as StringValue },
    );

    const refreshToken = jwt.sign(
      { adminId: admin.id },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as StringValue },
    );

    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
    });

    const { password: _, ...adminNoPassword } = admin;

    res.json({
      message: "admin logged in",
      accessToken,
      data: adminNoPassword,
    });
  } catch (error) {
    console.error(error);
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

export async function refreshToken(req: Request, res: Response): Promise<void> {
  try {
    const refreshToken = req.cookies.refreshToken as string;
    if (!refreshToken) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { adminId } = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
    ) as { adminId: string };

    const admin = await adminsRepo.findOneBy({ id: adminId });
    if (!admin) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const accessToken = jwt.sign(
      { adminId: admin.id },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN as StringValue },
    );
    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
