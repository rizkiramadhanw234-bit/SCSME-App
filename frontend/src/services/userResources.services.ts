import { axiosApi } from "./axios";
import type { Resource } from "@/types";

// public resources
export const getPublicUserResources = async () => {
  const res = await axiosApi.get<{ data: Resource[] }>(
    `/user-resources/public`,
  );
  return res.data.data;
};

export const getPaidUserResourcesLevel = async (userId: string) => {
  const res = await axiosApi.get<{ data: Resource[] }>(
    `/user-resources/isPaid/${userId}`,
  );
  return res.data.data;
};

// paid Resources
export const getPaidResources = async () => {
  const res = await axiosApi.get<{ data: Resource[] }>(`/user-resources/paid`);
  return res.data.data;
};
