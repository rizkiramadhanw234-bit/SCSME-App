import { axiosApi } from "./axios";
import type {
  Subscription,
  CreateSubscriptionRequest,
  UpgradeSubscriptionRequest,
} from "@/types";

export const createSubscription = async (data: CreateSubscriptionRequest) => {
  const response = await axiosApi.post<{ data: Subscription }>(
    "/subscription/",
    data,
  );
  return response.data;
};

export const upgradeSubscription = async (
  id: string,
  data: UpgradeSubscriptionRequest,
) => {
  const response = await axiosApi.put<{ data: Subscription }>(
    `/subscription/${id}`,
    data,
  );
  return response.data;
};

export const deleteSubscription = async (id: string) => {
  const response = await axiosApi.delete<{ data: Subscription }>(
    `/subscription/${id}`,
  );
  return response.data;
};

export const getSubscriptionById = async (id: string) => {
  const response = await axiosApi.get<{ data: Subscription }>(
    `/subscription/${id}`,
  );
  return response.data;
};

export const getSubscriptionByUserId = async (userId: string) => {
  const response = await axiosApi.get<{ data: Subscription }>(
    `/subscription/user/${userId}`,
  );
  return response.data;
};
