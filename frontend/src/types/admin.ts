import { BaseEntity } from "./base";
import { AdminRole } from "./enums";

export interface Admin extends BaseEntity {
  name: string;
  email: string;
  adminRole: AdminRole;
  isActive: boolean;
  lastLoginAt: string | null;
}

export interface CreateAdminRequest {
  name: string;
  email: string;
  password: string;
  adminRole: AdminRole;
}

export interface UpdateAdminRequest {
  name?: string;
  email?: string;
  password?: string;
  adminRole?: AdminRole;
}
