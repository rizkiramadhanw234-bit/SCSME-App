import { BaseEntity } from "./base";
import { AttendanceStatus, PaymentStatus, TicketType } from "./enums";

export interface EventRegistration extends BaseEntity {
  eventId: string;
  userId: string;
  ticketType: TicketType;
  paymentStatus: PaymentStatus;
  qrCode: string | null;
  attendanceStatus: AttendanceStatus;
  certificateUrl: string | null;
}

export interface CreateEventRegistrationRequest {
  eventId: string;
  userId: string;
  ticketType: TicketType;
  attendanceStatus?: AttendanceStatus;
  certificateUrl?: string;
}

export interface VerifyEventRegistrationRequest {
  paymentStatus: PaymentStatus;
}
