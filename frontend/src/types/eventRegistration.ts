import { BaseEntity } from "./base";
import { Event } from "./event";
import { AttendanceStatus, PaymentStatus, TicketType } from "./enums";

export interface EventRegistration extends BaseEntity {
  eventId: string;
  userId: string;
  ticketType: string;
  paymentStatus: string;
  qrCode: string;
  attendanceStatus: string;
  certificateUrl: string;
  orderCode: string;
  event: Event;
}

export interface CreateEventRegistrationRequest {
  eventId: string;
  userId: string;
  ticketType: TicketType | string;
  attendanceStatus?: AttendanceStatus | string;
}

export interface VerifyEventRegistrationRequest {
  paymentStatus: PaymentStatus;
}
