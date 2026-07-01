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
