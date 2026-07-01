import { axiosApi } from "./axios";
import type { Resource } from "@/types";

export const getResources = async () => {
  const res = await axiosApi.get<{ data: Resource[] }>(`/resources`);
  return res.data.data;
};

export const getResourceById = async (id: string) => {
  const res = await axiosApi.get<{ data: Resource }>(`/resources/${id}`);
  return res.data.data;
};
