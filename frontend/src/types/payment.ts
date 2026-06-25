import { BaseEntity } from "./base";
import { OrderType, PaymentStatus } from "./enums";

export interface Payment extends BaseEntity {
  userId: string;
  orderType: OrderType;
  orderId: string;
  amount: string;
  paymentStatus: PaymentStatus;
  invoiceUrl: string | null;
  proofUrl: string | null;
}

export interface CreatePaymentFormData {
  userId: string;
  orderId: string;
  orderType: OrderType;
  amount: string | number;
  proofUrl: File;
}

export interface VerifyPaymentRequest {
  paymentStatus: PaymentStatus;
}
