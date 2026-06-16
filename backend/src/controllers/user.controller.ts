import { User } from "../entities/user.entity";
import { Request, Response } from "express";
import { AppDataSource } from "../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Like } from "typeorm/browser";

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
      const { passwordHash, ...userNoPassword } = user;
      return userNoPassword;
    });
    res.json({
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
    const { passwordHash, ...userNoPassword } = user;
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
    const { passwordHash, ...userNoPassword } = user;
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
        const { passwordHash, ...userNoPassword } = user;
        return userNoPassword;
      });
      res.json({
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
    const { name, email, passwordHash, role } = req.body as User;
    if (!name || !email || !passwordHash || !role) {
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
    const emailExists = await usersRepo.findOneBy({ email });
    if (emailExists) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }
    const hashedPassword = await bcrypt.hash(passwordHash, 10);
    const newUser = await usersRepo.save({
      name,
      email,
      passwordHash: hashedPassword,
      role,
    });
    const { passwordHash: _, ...userNoPassword } = newUser;
    res.status(201).json({ message: "User created", data: userNoPassword });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateUser(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const { name, email, passwordHash } = req.body as User;
    const user = await usersRepo.findOneBy({ id });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (
      name === user.name &&
      email === user.email &&
      passwordHash === user.passwordHash
    ) {
      res.status(400).json({ message: "No changes" });
      return;
    }
    if (name) {
      user.name = name;
    }
    if (email) {
      user.email = email;
    }
    let hashedPassword = user.passwordHash;
    if (passwordHash) {
      hashedPassword = await bcrypt.hash(passwordHash, 10);
      user.passwordHash = hashedPassword;
    }
    if (passwordHash.length < 8) {
      res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
      return;
    }

    const updatedUser = await usersRepo.save(user);
    const { passwordHash: _, ...userNoPassword } = updatedUser;

    res.status(200).json({ message: "User updated", data: userNoPassword });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function loginUser(req: Request, res: Response): Promise<void> {
  try {
    const { email, passwordHash } = req.body;
    const user = await usersRepo.findOneBy({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const isPasswordMatch = await bcrypt.compare(
      passwordHash,
      user.passwordHash,
    );

    if (!isPasswordMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
    );

    res.json({ message: "user logged in", token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function logoutUser(req: Request, res: Response): Promise<void> {
  try {
    res.clearCookie("userToken");
    res.json({ message: "user logged out" });
  } catch (error) {
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
