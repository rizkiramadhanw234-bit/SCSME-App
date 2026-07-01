import { BaseEntity } from "./base";
import { PaymentStatus } from "./enums";

export interface ResourcePurchase extends BaseEntity {
  resourceId: string;
  userId: string;
  paymentStatus: PaymentStatus;
  orderCode: string;
}

export interface CreateResourcePurchaseRequest {
  userId: string;
  resourceId: string;
}

export interface VerifyResourcePurchaseRequest {
  paymentStatus: PaymentStatus;
}
