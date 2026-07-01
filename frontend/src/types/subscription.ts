import { BaseEntity } from "./base";
import { PaymentStatus, RenewalStatus } from "./enums";
import { MembershipPlan } from "./membershipPlan";

export interface Subscription extends BaseEntity {
  userId: string;
  planId: string;
  startDate: string;
  endDate: string;
  paymentStatus: PaymentStatus;
  renewalStatus: RenewalStatus;
  plan: MembershipPlan;
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
  paymentStatus: PaymentStatus;
}

export interface VerifySubscriptionRequest {
  paymentStatus: PaymentStatus;
}
