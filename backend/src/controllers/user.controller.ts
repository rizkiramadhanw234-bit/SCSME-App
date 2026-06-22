import { User } from "../entities/user.entity";
import { Request, Response } from "express";
import { AppDataSource } from "../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Like } from "typeorm/browser";
import type { StringValue } from "ms";

const usersRepo = AppDataSource.getRepository(User);

export async function getUsers(req: Request, res: Response): Promise<void> {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const users = await usersRepo.find({
      take: limit,
      skip: offset,
    });
    const userNoPassword = users.map((user) => {
      const { password, ...userNoPassword } = user;
      return userNoPassword;
    });
    res.status(200).json({
      message: "user fetched",
      data: userNoPassword,
      meta: {
        total: users.length,
        limit,
        offset,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getUserById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const user = await usersRepo.findOneBy({ id });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const { password, ...userNoPassword } = user;
    res.json({ message: "user fetched", data: userNoPassword });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getUserByEmail(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { email } = req.query as { email: string };
    const user = await usersRepo.findOneBy({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const { password, ...userNoPassword } = user;
    res.json({ message: "user fetched", data: userNoPassword });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function searchUserByName(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { name } = req.query as { name: string };
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const user = await usersRepo.find({
      where: {
        name: Like(`%${name}%`),
      },
      take: limit,
      skip: offset,
      order: {
        name: "ASC",
      },
    });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    } else {
      const userNoPassword = user.map((user) => {
        const { password, ...userNoPassword } = user;
        return userNoPassword;
      });
      res.status(200).json({
        message: "user fetched",
        data: userNoPassword,
        meta: {
          total: user.length,
          limit,
          offset,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createUser(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, phone, password, role } = req.body as User;
    if (!name || !email || !password || !role) {
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
    const emailExists = await usersRepo.findOneBy({ email });
    if (emailExists) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await usersRepo.save({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
    });
    const { password: _, ...userNoPassword } = newUser;
    res.status(201).json({ message: "User created", data: userNoPassword });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateUser(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const { name, email, password } = req.body as User;
    const user = await usersRepo.findOneBy({ id });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      res.status(400).json({ message: "Invalid email format" });
      return;
    }
    if (
      name === user.name &&
      email === user.email &&
      password === user.password
    ) {
      res.status(400).json({ message: "No changes" });
      return;
    }
    let hashedPassword = user.password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    if (password.length < 8) {
      res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
      return;
    }
    const updatedUser = await usersRepo.save({
      ...user,
      name,
      email,
      password: hashedPassword,
    });
    const { password: _, ...userNoPassword } = updatedUser;
    res.status(200).json({ message: "User updated", data: userNoPassword });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    await usersRepo.delete({ id });
    res.status(200).json({ message: "user deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function loginUser(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const user = await usersRepo.findOneBy({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN as StringValue },
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as StringValue },
    );

    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
    });

    const { password: _, ...userNoPassword } = user;
    res
      .status(200)
      .json({ message: "user logged in", accessToken, data: userNoPassword });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function logoutUser(req: Request, res: Response): Promise<void> {
  try {
    res.clearCookie("refreshToken");
    res.json({ message: "user logged out" });
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
    const { userId } = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
    ) as { userId: string };

    const user = await usersRepo.findOneBy({ id: userId });
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN as StringValue },
    );
    res.json({ accessToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
