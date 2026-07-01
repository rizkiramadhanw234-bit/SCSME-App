import { axiosApi } from "./axios";
import type { Payment, CreatePaymentFormData } from "@/types";

export const createPayment = async (data: CreatePaymentFormData) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value as string | Blob);
    }
  });
  const response = await axiosApi.post<{ data: Payment }>(
    "/payment/create",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data.data;
};

export const getPaymentByUserId = async (userId: string) => {
  const response = await axiosApi.get<{ data: Payment[] }>(
    `/payment/user/${userId}`,
  );
  return response.data.data;
};

export const getPaymentById = async (id: string) => {
  const response = await axiosApi.get<{ data: Payment }>(`/payment/${id}`);
  return response.data.data;
};
