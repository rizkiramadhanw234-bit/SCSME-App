import { axiosApi } from "./axios";
import type {
  PaidUpload,
  CreatePaidUploadFormData,
  UpdatePaidUploadFormData,
} from "@/types";

export const createPaidUpload = async (data: CreatePaidUploadFormData) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value as string | Blob);
    }
  });
  const res = await axiosApi.post<{ data: PaidUpload }>(
    "/paid-uploads/create",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return res.data.data;
};

export const updatePaidUpload = async (
  id: string,
  data: UpdatePaidUploadFormData,
) => {
  const res = await axiosApi.put<{ data: PaidUpload }>(
    `/paid-uploads/update/${id}`,
    data,
  );
  return res.data.data;
};

export const getPaidUploadByUserId = async (userId: string) => {
  const res = await axiosApi.get<{ data: PaidUpload[] }>(
    `/paid-uploads/user/${userId}`,
  );
  return res.data.data;
};

export const getPaidUploadById = async (id: string) => {
  const res = await axiosApi.get<{ data: PaidUpload }>(`/paid-uploads/${id}`);
  return res.data.data;
};

export const deletePaidUpload = async (id: string) => {
  const res = await axiosApi.delete<{ data: PaidUpload }>(
    `/paid-uploads/delete/${id}`,
  );
  return res.data.data;
};
