import { BaseEntity } from "./base";
import { Category } from "./category";
import { VerificationStatus } from "./enums";

export interface Company extends BaseEntity {
  userId: string;
  companyName: string;
  categoryId: string;
  description: string | null;
  logoUrl: string | null;
  website: string | null;
  verificationStatus: VerificationStatus | string;
  category: Category | null;
}

export interface CreateCompanyRequest {
  userId: string;
  companyName: string;
  categoryId: string;
  description?: string | null;
  logoUrl?: File | string | null;
  website?: string | null;
}

export interface UpdateCompanyRequest {
  companyName?: string;
  categoryId?: string;
  description?: string;
  logoUrl?: File | string | null;
  website?: string;
}

export interface VerifyCompanyRequest {
  verificationStatus: VerificationStatus;
}
