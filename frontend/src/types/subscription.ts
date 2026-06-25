import { BaseEntity } from "./base";
import { PaymentStatus, RenewalStatus } from "./enums";

export interface Subscription extends BaseEntity {
  userId: string;
  planId: string;
  startDate: string;
  endDate: string;
  paymentStatus: PaymentStatus;
  renewalStatus: RenewalStatus;
}

export interface CreateSubscriptionRequest {
  userId: string;
  planId: string;
  renewalStatus?: RenewalStatus;
}

export interface UpgradeSubscriptionRequest {
  userId: string;
  planId: string;
  startDate: string;
  endDate: string;
  renewalStatus: RenewalStatus;
}

export interface VerifySubscriptionRequest {
  paymentStatus: PaymentStatus;
}
