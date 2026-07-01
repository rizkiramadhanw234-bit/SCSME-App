import { BaseEntity } from "./base";
import { OrderType, PaymentStatus } from "./enums";

export interface Payment extends BaseEntity {
  userId: string;
  orderType: OrderType;
  orderCode: string;
  amount: string;
  paymentStatus: PaymentStatus;
  invoiceUrl: string | null;
  proofUrl: string | null;
  paymentCode: string;
}

export interface CreatePaymentFormData {
  userId: string;
  orderCode: string;
  orderType: OrderType | string;
  amount: string | number;
  proofUrl: File;
}

export interface VerifyPaymentRequest {
  paymentStatus: PaymentStatus;
}
