import { axiosApi } from "./axios";
import { CreateResourcePurchaseRequest, ResourcePurchase } from "@/types";

export const createResourcePurchase = async (
  data: CreateResourcePurchaseRequest,
) => {
  const res = await axiosApi.post<{ data: ResourcePurchase }>(
    `/resource-purchases/create/`,
    data,
  );
  return res.data.data;
};

export const getResourcePurchaseById = async (id: string) => {
  const res = await axiosApi.get<{ data: ResourcePurchase }>(
    `/resource-purchases/${id}`,
  );
  return res.data.data;
};

export const deleteResourcePurchases = async (id: string) => {
  const res = await axiosApi.delete<{ data: ResourcePurchase }>(
    `/resource-purchases/delete/${id}`,
  );
  return res.data.data;
};
