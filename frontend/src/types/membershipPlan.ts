import { BaseEntity } from "./base";

export interface MembershipPlan extends BaseEntity {
  planName: string;
  price: string;
  durationDays: number;
  benefits: string | null;
  isActive: number;
}

export interface CreateMembershipPlanRequest {
  planName: string;
  price: string | number;
  durationDays: string | number;
  benefits?: string;
}

export type UpdateMembershipPlanRequest = CreateMembershipPlanRequest;
