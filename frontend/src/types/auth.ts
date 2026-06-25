import { UserRole } from "./enums";
import { User } from "./user";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string | null;
  role: UserRole | "";
}

export interface AuthResponse {
  message: string;
  accessToken: string;
  data: User;
}
