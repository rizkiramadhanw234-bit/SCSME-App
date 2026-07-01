import { BaseEntity } from "./base";
import { Company } from "./company";
import {
  PaymentStatus,
  RenewalStatus,
  TicketType,
  AttendanceStatus,
  PaidUploadType,
  PaidUploadStatus,
} from "./enums";
import { Event } from "./event";
import { MembershipPlan } from "./membershipPlan";
import { Resource } from "./resource";

export interface PendingEventRegistration extends BaseEntity {
  eventId: string;
  userId: string;
  ticketType: TicketType;
  paymentStatus: PaymentStatus | null;
  qrCode: string | null;
  attendanceStatus: AttendanceStatus;
  certificateUrl: string | null;
  orderCode: string;
  event: Event;
}

export interface PendingSubscription extends BaseEntity {
  userId: string;
  planId: string;
  startDate: string;
  endDate: string;
  paymentStatus: PaymentStatus;
  renewalStatus: RenewalStatus;
  orderCode: string;
  plan: MembershipPlan | null;
}

export interface PendingResourcePurchase extends BaseEntity {
  resourceId: string;
  userId: string;
  paymentStatus: PaymentStatus;
  orderCode: string;
  resource: Resource | null;
}

export interface PendingPaidUpload extends BaseEntity {
  userId: string;
  companyId: string;
  uploadType: PaidUploadType;
  title: string;
  description: string;
  imageUrl: string;
  targetUrl: string;
  placement: string;
  price: string;
  startDate: string;
  endDate: string;
  status: PaidUploadStatus;
  adminNotes: string | null;
  seoTitle: string;
  metaDescription: string;
  altText: string;
  paymentStatus: PaymentStatus;
  orderCode: string;
  company: Company | null;
}
