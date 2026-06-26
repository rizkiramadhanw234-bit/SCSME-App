import { Request, Response } from "express";
import { Payment } from "../entities/payment.entity";
import { AppDataSource } from "../config/db";

const paymentsRepo = AppDataSource.getRepository(Payment);

export async function getPayments(req: Request, res: Response): Promise<void> {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const getPayments = await paymentsRepo.find({
      take: limit,
      skip: offset,
    });
    res.status(200).json({
      message: "Payments fetched",
      data: getPayments,
      meta: { total: getPayments.length, limit, offset },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getPaymentById(
  req: Request,
  res: Response,
): Promise<void> {
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

export async function getPendingPaymentStatus(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const pendingPayments = await paymentsRepo.find({
      where: { paymentStatus: "pending" },
    });
    res
      .status(200)
      .json({ message: "Pending payments fetched", data: pendingPayments });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updatePaymentStatus(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const { paymentStatus } = req.body as Payment;
    const payment = await paymentsRepo.findOneBy({ id });
    if (!payment) {
      res.status(404).json({ message: "Payment not found" });
      return;
    }

    const paidStatus = paymentStatus === "paid";
    const failedStatus = paymentStatus === "failed";
    const refundedStatus = paymentStatus === "refunded";

    const updatedPayment = await paymentsRepo.save({
      ...payment,
      paymentStatus: paidStatus
        ? "paid"
        : failedStatus
          ? "failed"
          : refundedStatus
            ? "refunded"
            : "pending",
    });

    if (!updatedPayment) {
      res.status(404).json({ message: "Failed to update payment status" });
      return;
    }

    res
      .status(200)
      .json({ message: "Payment status updated", data: updatedPayment });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deletePayment(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const payment = await paymentsRepo.findOneBy({ id });
    if (!payment) {
      res.status(404).json({ message: "Payment not found" });
      return;
    }
    await paymentsRepo.delete({ id });
    res.status(200).json({ message: "Payment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getRevenueStats(req: Request, res: Response) {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const result = await paymentsRepo
      .createQueryBuilder("payment")
      .select("SUM(payment.amount)", "totalRevenue")
      .addSelect("COUNT(payment.id)", "totalTransactions")
      .addSelect("payment.orderType", "orderType")
      .where("payment.paymentStatus = :status", { status: "paid" })
      .andWhere("MONTH(payment.createdAt) = :month", { month })
      .andWhere("YEAR(payment.createdAt) = :year", { year })
      .groupBy("payment.orderType")
      .getRawMany();

    const totalRevenue = result.reduce(
      (sum, r) => sum + parseFloat(r.totalRevenue || 0),
      0,
    );
    const totalTransactions = result.reduce(
      (sum, r) => sum + parseInt(r.totalTransactions || 0),
      0,
    );

    res.status(200).json({
      message: "Revenue stats fetched",
      data: {
        month,
        year,
        totalRevenue,
        totalTransactions,
        breakdown: result,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
