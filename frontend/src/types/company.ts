import { BaseEntity } from "./base";
import { VerificationStatus } from "./enums";

export interface Company extends BaseEntity {
  userId: string;
  companyName: string;
  categoryId: string;
  description: string | null;
  logoUrl: string | null;
  website: string | null;
  verificationStatus: VerificationStatus;
}

export interface CreateCompanyRequest {
  userId: string;
  companyName: string;
  categoryId: string;
  description?: string;
  logoUrl?: string;
  website?: string;
}

export interface UpdateCompanyRequest {
  companyName?: string;
  categoryId?: string;
  description?: string;
  logoUrl?: string;
  website?: string;
}

export interface VerifyCompanyRequest {
  verificationStatus: VerificationStatus;
}
