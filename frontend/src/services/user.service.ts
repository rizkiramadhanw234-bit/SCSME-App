import { axiosApi } from "./axios";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UpdateUserRequest,
  User,
} from "@/types";

export const registerUser = async (data: RegisterRequest) => {
  const res = await axiosApi.post<{ data: AuthResponse }>(
    "/user/register",
    data,
  );
  return res.data.data;
};

export const loginUser = async (data: LoginRequest) => {
  const res = await axiosApi.post<{ data: AuthResponse & { user: User } }>(
    "/user/login",
    data,
  );
  return res.data.data;
};

export const logoutUser = async () => {
  const res = await axiosApi.post("/user/logout");
  return res.data;
};

export const getUserById = async (id: string) => {
  const res = await axiosApi.get<{ data: User }>(`/user/${id}`);
  return res.data;
};

export const updateUser = async (id: string, data: UpdateUserRequest) => {
  const res = await axiosApi.put<{ data: User }>(`/user/${id}`, data);
  return res.data.data;
};

export const refreshToken = async () => {
  const res = await axiosApi.post<{ data: AuthResponse & { user: User } }>(
    "/user/refresh-token",
  );
  return res.data.data;
};
