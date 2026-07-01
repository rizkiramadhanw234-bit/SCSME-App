import { axiosApi } from "./axios";
import {
  PendingEventRegistration,
  PendingSubscription,
  PendingResourcePurchase,
  PendingPaidUpload,
} from "@/types/pendingOrders";

export const getPendingEventOrder = async (userId: string) => {
  const res = await axiosApi.get<{ data: PendingEventRegistration[] }>(
    `/pending-orders/event/${userId}`,
  );
  return res.data.data;
};

export const getPendingSubsOrder = async (userId: string) => {
  const res = await axiosApi.get<{ data: PendingSubscription[] }>(
    `/pending-orders/subscription/${userId}`,
  );
  return res.data.data;
};

export const getPendingResourceOrder = async (userId: string) => {
  const res = await axiosApi.get<{ data: PendingResourcePurchase[] }>(
    `/pending-orders/resource/${userId}`,
  );
  return res.data.data;
};

export const getPendingPaidUploadOrder = async (userId: string) => {
  const res = await axiosApi.get<{ data: PendingPaidUpload[] }>(
    `/pending-orders/upload/${userId}`,
  );
  return res.data.data;
};
