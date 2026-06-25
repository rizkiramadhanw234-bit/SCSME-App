import { axiosApi } from "./axios";
import type {
  Company,
  CreateCompanyRequest,
  UpdateCompanyRequest,
} from "@/types";

export const createCompany = async (data: CreateCompanyRequest) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value as string | Blob);
    }
  });
  const res = await axiosApi.post<{ data: Company }>(
    "/company/create",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return res.data.data;
};

export const updateCompany = async (id: string, data: UpdateCompanyRequest) => {
  const res = await axiosApi.put<{ data: Company }>(
    `/company/update/${id}`,
    data,
  );
  return res.data.data;
};

export const getCompanies = async () => {
  const res = await axiosApi.get<{ data: Company[] }>("/company");
  return res.data.data;
};

export const getCompanyById = async (id: string) => {
  const res = await axiosApi.get<{ data: Company }>(`/company/${id}`);
  return res.data.data;
};

export const deleteCompany = async (id: string) => {
  const res = await axiosApi.delete<{ data: Company }>(`/company/delete/${id}`);
  return res.data.data;
};
