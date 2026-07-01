import { axiosApi } from "./axios";
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/types";

export const getCategories = async () => {
  const res = await axiosApi.get<{ data: Category[] }>("/category");
  return res.data.data;
};

export const getCategoryById = async (id: string) => {
  const res = await axiosApi.get<{ data: Category }>(`/category/${id}`);
  return res.data.data;
};

export const createCategory = async (data: CreateCategoryRequest) => {
  const res = await axiosApi.post<{ data: Category }>("/category/create", data);
  return res.data.data;
};

export const updateCategory = async (
  id: string,
  data: UpdateCategoryRequest,
) => {
  const res = await axiosApi.put<{ data: Category }>(
    `/category/update/${id}`,
    data,
  );
  return res.data.data;
};

export const deleteCategory = async (id: string) => {
  const res = await axiosApi.delete<{ data: Category }>(
    `/category/delete/${id}`,
  );
  return res.data.data;
};
