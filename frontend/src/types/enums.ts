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
export type OrderType = "membership" | "event" | "resource" | "paid_upload";

export type PaidUploadType =
  | "banner"
  | "brand"
  | "product_service"
  | "sponsored_article"
  | "push_notification"
  | "featured_listing"
  | "event_sponsor"
  | "training_sponsor"
  | "resource_sponsor";

export type PaidUploadStatus =
  | "draft"
  | "pending_payment"
  | "pending_review"
  | "revision_required"
  | "scheduled"
  | "published"
  | "expired"
  | "rejected";
