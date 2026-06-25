import { BaseEntity } from "./base";
import { UserRole, UserStatus } from "./enums";

export interface User extends BaseEntity {
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
}
