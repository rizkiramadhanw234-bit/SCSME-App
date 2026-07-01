import { useQuery } from "@tanstack/react-query";
import {
  getPendingEventOrder,
  getPendingPaidUploadOrder,
  getPendingResourceOrder,
  getPendingSubsOrder,
} from "@/services/pendingOrder.service";

const pendingOrdersKey = {
  event: "pendingEventOrder" as const,
  resource: "pendingResourceOrder" as const,
  upload: "pendingPaidUploadOrder" as const,
  subscription: "pendingSubsOrder" as const,
};

export const useGetPendingEventOrder = (userId: string) => {
  return useQuery({
    queryKey: [pendingOrdersKey.event, userId],
    queryFn: async () => {
      const res = await getPendingEventOrder(userId);
      return res;
    },
  });
};

export const useGetPendingResourceOrder = (userId: string) => {
  return useQuery({
    queryKey: [pendingOrdersKey.resource, userId],
    queryFn: async () => {
      const res = await getPendingResourceOrder(userId);
      return res;
    },
  });
};

export const useGetPendingPaidUploadOrder = (userId: string) => {
  return useQuery({
    queryKey: [pendingOrdersKey.upload, userId],
    queryFn: async () => {
      const res = await getPendingPaidUploadOrder(userId);
      return res;
    },
  });
};

export const useGetPendingSubsOrder = (userId: string) => {
  return useQuery({
    queryKey: [pendingOrdersKey.subscription, userId],
    queryFn: async () => {
      const res = await getPendingSubsOrder(userId);
      return res;
    },
  });
};
