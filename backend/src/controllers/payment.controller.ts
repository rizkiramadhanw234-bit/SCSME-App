import { Request, Response } from "express";
import { Payment } from "../entities/payment.entity";

import { AppDataSource } from "../config/db";

const paymentsRepo = AppDataSource.getRepository(Payment);

export async function createPayment(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { userId, orderCode, orderType, amount } = req.body as Payment;
    const proofUrl = req.file as Express.Multer.File;

    if (!userId || !orderCode || !orderType || !amount || !proofUrl) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const alreadyPaid = await paymentsRepo.findOneBy({ orderCode, userId });
    if (alreadyPaid) {
      res.status(400).json({ message: "Already paid" });
      return;
    }

    const newPayment = paymentsRepo.create({
      userId,
      orderCode,
      orderType,
      amount,
      paymentStatus: "pending",
      invoiceUrl: `${process.env.BASE_URL}/public/qrCodeBank/qrCode.png`,
      proofUrl: `${process.env.BASE_URL}/public/invoiceProof/${proofUrl.filename}`,
    });

    if (!newPayment) {
      res.status(404).json({ message: "Failed to create payment" });
      return;
    }
    const result = await paymentsRepo.save(newPayment);
    res.status(201).json({ message: "Payment created", data: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getPaymentById(req: Request, res: Response) {
  try {
    const { id } = req.params as { id: string };
    const getPayment = await paymentsRepo.findOneBy({ id });
    if (!getPayment) {
      res.status(404).json({ message: "Payment not found" });
      return;
    }
    res.status(200).json({ message: "Payment fetched", data: getPayment });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getPaymentsByUserId(req: Request, res: Response) {
  try {
    const { userId } = req.params as { userId: string };
    const getPayments = await paymentsRepo.find({
      where: { userId },
      relations: { user: true },
    });
    if (!getPayments) {
      res.status(404).json({ message: "Payments not found" });
      return;
    }
    res
      .status(200)
      .json({ message: "Payments by userId fetched", data: getPayments });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getPayments(req: Request, res: Response) {
  try {
    const getPayments = await paymentsRepo.find();
    res.status(200).json({ message: "Payments fetched", data: getPayments });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deletePayment(req: Request, res: Response) {
  try {
    const { id } = req.params as { id: string };
    await paymentsRepo.delete({ id });
    res.status(200).json({ message: "Payment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
