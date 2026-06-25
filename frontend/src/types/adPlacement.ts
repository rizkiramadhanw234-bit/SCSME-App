import { BaseEntity } from "./base";

export interface AdPlacement extends BaseEntity {
  paidUpload_id: string;
  page: string;
  position: string | null;
  impressions: number;
  clicks: number;
  publishedAt: string | null;
  expiresAt: string | null;
}

export interface CreateAdPlacementRequest extends BaseEntity {
  paidUpload_id: string;
  page: string;
  position?: string;
  publishedAt?: string;
  expiresAt?: string;
}

export type UpdateAdPlacementRequest = Partial<
  Omit<CreateAdPlacementRequest, "paidUpload_id">
>;
