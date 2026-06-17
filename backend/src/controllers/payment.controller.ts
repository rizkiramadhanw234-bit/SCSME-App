import { Request, Response } from "express";
import { Payment } from "../entities/payment.entity";
import { Subscription } from "../entities/subscription.entity";
import { AppDataSource } from "../config/db";

const paymentsRepo = AppDataSource.getRepository(Payment);
const subscriptionsRepo = AppDataSource.getRepository(Subscription);

export async function createPayment(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { userId, orderId, orderType, amount, invoiceUrl, proofUrl } =
      req.body as Payment;

    const pendingSubscription = await subscriptionsRepo.findOneBy({ userId });
    if (!pendingSubscription) {
      res.status(404).json({ message: "subscription not found" });
      return;
    }

    const newPayment = await paymentsRepo.save({
      userId,
      orderId,
      orderType,
      amount,
      paymentStatus: "paid",
      invoiceUrl,
      proofUrl,
    });

    if (!newPayment) {
      res.status(404).json({ message: "Failed to create payment" });
      return;
    }
    await subscriptionsRepo.update({ userId }, { paymentStatus: "paid" });

    res.status(201).json({ message: "Payment created", data: newPayment });
  } catch (error) {
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
