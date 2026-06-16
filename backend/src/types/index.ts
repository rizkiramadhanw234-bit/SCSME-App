export type UserRole = "guest" | "member" | "corporate" | "sponsor";
export type UserStatus = "active" | "inactive" | "suspended";
export type AdminRole = "staff" | "super_admin";
export type VerificationStatus = "pending" | "verified" | "rejected";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type RenewalStatus = "active" | "expired" | "cancelled";
export type EventStatus = "draft" | "published" | "cancelled";
export type TicketType = "standard" | "vip";
export type AttendanceStatus = "registered" | "attended" | "absent";
export type ResourceType = "article" | "template" | "replay" | "course";
export type AccessLevel = "public" | "member" | "paid";
export type PaidUploadType =
  | "banner"
  | "brand"
  | "productService"
  | "sponsoredArticle"
  | "pushNotification"
  | "featuredListing"
  | "eventSponsor"
  | "trainingSponsor"
  | "resourceSponsor";

export type PaidUploadStatus =
  | "draft"
  | "pendingPayment"
  | "pendingReview"
  | "revisionRequired"
  | "scheduled"
  | "published"
  | "expired"
  | "rejected";

export type OrderType = "membership" | "event" | "resource" | "paidUpload";

// Base interfaces
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
}

// User interfaces
export interface User extends BaseEntity {
  name: string;
  email: string;
  phone: string | null;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
}

export interface Admin extends BaseEntity {
  name: string;
  email: string;
  passwordHash: string;
  adminRole: AdminRole;
  isActive: boolean;
  lastLoginAt: Date | null;
}

export interface Category extends BaseEntity {
  name: string;
  slug: string;
  isActive: boolean;
}

export interface Company extends BaseEntity {
  userId: string;
  companyName: string;
  categoryId: Category;
  description: string | null;
  logoUrl: string | null;
  website: string | null;
  verificationStatus: VerificationStatus;
}

export interface MembershipPlan {
  id: string;
  planName: string;
  price: number;
  durationDays: number;
  benefits: string | null;
  isActive: boolean;
}

export interface Subscription extends BaseEntity {
  userId: string;
  planId: string;
  startDate: Date;
  endDate: Date;
  paymentStatus: PaymentStatus;
  renewalStatus: RenewalStatus;
}

export interface Event extends BaseEntity {
  title: string;
  description: string | null;
  eventDate: Date;
  location: string | null;
  price: number;
  capacity: number;
  status: EventStatus;
  coverImage: string | null;
  language: string | null;
}

export interface EventRegistration extends BaseEntity {
  eventId: string;
  userId: string;
  ticketType: TicketType;
  paymentStatus: PaymentStatus;
  qrCode: string | null;
  attendanceStatus: AttendanceStatus;
  certificateUrl: string | null;
}

export interface Resource extends BaseEntity {
  title: string;
  type: ResourceType;
  accessLevel: AccessLevel;
  price: number;
  fileUrl: string | null;
  coverImage: string | null;
  seoTitle: string | null;
  metaDescription: string | null;
}

export interface ResourcePurchase {
  id: string;
  resourceId: string;
  userId: string;
  paymentStatus: PaymentStatus;
  createdAt: Date;
}

export interface PaidUpload extends BaseEntity {
  userId: string;
  companyId: string;
  uploadType: PaidUploadType;
  title: string;
  description: string | null;
  imageUrl: string | null;
  targetUrl: string | null;
  placement: string | null;
  price: number;
  startDate: Date | null;
  endDate: Date | null;
  status: PaidUploadStatus;
  adminNotes: string | null;
  seoTitle: string | null;
  metaDescription: string | null;
  altText: string | null;
}

export interface AdPlacement {
  id: string;
  paidUploadId: string;
  page: string;
  position: string | null;
  impressions: number;
  clicks: number;
  publishedAt: Date | null;
  expiresAt: Date | null;
}

export interface Payment {
  id: string;
  userId: string;
  orderType: OrderType;
  orderId: string;
  amount: number;
  paymentStatus: PaymentStatus;
  invoiceUrl: string | null;
  proofUrl: string | null;
  createdAt: Date;
}

export interface AdminLog {
  id: string;
  adminId: string;
  action: string;
  targetType: string;
  targetId: string;
  notes: string | null;
  createdAt: Date;
}
