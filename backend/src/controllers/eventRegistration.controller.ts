import { EventRegistration } from "../entities/event-registration.entity";
import { AppDataSource } from "../config/db";
import { Request, Response } from "express";
import { generateTicketQR } from "../lib/qrCodeGenerator";

const eventRegistrationsRepo = AppDataSource.getRepository(EventRegistration);

export async function getRegistrations(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const getRegistrations = await eventRegistrationsRepo.find();
    res
      .status(200)
      .json({ message: "Registrations fetched", data: getRegistrations });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getRegistrationById(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const getRegistration = await eventRegistrationsRepo.findOneBy({ id });
    if (!getRegistration) {
      res.status(404).json({ message: "Registration not found" });
      return;
    }
    res
      .status(200)
      .json({ message: "Registration fetched", data: getRegistration });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createRegistration(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const {
      eventId,
      userId,
      ticketType,
      paymentStatus,
      attendanceStatus,
      certificateUrl,
    } = req.body as EventRegistration;

    const alreadyRegistered = await eventRegistrationsRepo.findOneBy({
      eventId,
      userId,
    });
    if (alreadyRegistered) {
      res
        .status(400)
        .json({ message: "User already registered for this event" });
      return;
    }

    const ticketTypes = ["standard", "vip"];
    if (!ticketTypes.includes(ticketType)) {
      res
        .status(400)
        .json({ message: "Ticket type must be either standard or vip" });
      return;
    }
    const qrCodeUrl = await generateTicketQR(eventId);
    const newRegistration = await eventRegistrationsRepo.save({
      eventId,
      userId,
      ticketType: ticketType ? "standard" : "vip",
      paymentStatus,
      qrCode: qrCodeUrl,
      attendanceStatus,
      certificateUrl,
    });
    res
      .status(200)
      .json({ message: "Registration created", data: newRegistration });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getQrCodeEventRegistration(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const registration = await eventRegistrationsRepo.findOneBy({ id });
    if (!registration) {
      res.status(404).json({ message: "Registration not found" });
      return;
    }
    res
      .status(200)
      .json({ message: "Registration fetched", data: registration.qrCode });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteRegistration(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const registration = await eventRegistrationsRepo.findOneBy({ id });
    if (!registration) {
      res.status(404).json({ message: "Registration not found" });
      return;
    }
    await eventRegistrationsRepo.delete({ id });
    res.status(200).json({ message: "Registration deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function verifyPaymentEventRegistration(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const { paymentStatus } = req.body as EventRegistration;
    const registration = await eventRegistrationsRepo.findOneBy({ id });
    if (!registration) {
      res.status(404).json({ message: "Registration not found" });
      return;
    }

    const isPaid = paymentStatus === "paid";
    const isRefunded = paymentStatus === "refunded";
    const updatedRegistration = await eventRegistrationsRepo.save({
      ...registration,
      paymentStatus: isPaid ? "paid" : isRefunded ? "refunded" : "pending",
    });
    res
      .status(200)
      .json({ message: "Registration verified", data: updatedRegistration });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
