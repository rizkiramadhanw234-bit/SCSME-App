import { BaseEntity } from "./base";
import { Company } from "./company";
import { PaymentStatus } from "./enums";
import { PaidUploadStatus, PaidUploadType } from "./enums";

export interface PaidUpload extends BaseEntity {
  userId: string;
  companyId: string;
  uploadType: PaidUploadType;
  title: string;
  description: string | null;
  imageUrl: string | null;
  targetUrl: string | null;
  placement: string | null;
  price: string;
  startDate: string | null;
  endDate: string | null;
  status: PaidUploadStatus;
  adminNotes: string | null;
  seoTitle: string | null;
  metaDescription: string | null;
  altText: string | null;
  paymentStatus: PaymentStatus | null;
  orderCode: string | null;
  company: Company | null;
}

export interface CreatePaidUploadFormData {
  userId: string;
  companyId: string;
  uploadType: PaidUploadType | string;
  title: string;
  description: string;
  imageUrl: File | string | null;
  targetUrl: string;
  placement: string;
  price: number;
  seoTitle?: string;
  metaDescription?: string;
  altText?: string;
}

export interface UpdatePaidUploadFormData {
  id: string;
  companyId: string;
  uploadType: PaidUploadType | string;
  title: string;
  description?: string;
  imageUrl: File;
  targetUrl?: string;
  placement?: string;
  price: string | number;
  seoTitle?: string;
  metaDescription?: string;
  altText?: string;
}

export interface ApprovePaidUploadRequest extends BaseEntity {
  status: PaidUploadStatus;
  adminNotes?: string;
}
