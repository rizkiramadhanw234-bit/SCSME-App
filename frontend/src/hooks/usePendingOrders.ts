import { useQuery } from "@tanstack/react-query";
import {
  getPendingEventOrder,
  getPendingPaidUploadOrder,
  getPendingResourceOrder,
  getPendingSubsOrder,
} from "@/services/pendingOrder.service";

export const pendingOrdersKey = {
  event: "pendingEventOrder" as const,
  eventLists: () => [...pendingOrdersKey.event, "lists"] as const,
  resource: "pendingResourceOrder" as const,
  resourceLists: () => [...pendingOrdersKey.resource, "lists"] as const,
  upload: "pendingPaidUploadOrder" as const,
  uploadLists: () => [...pendingOrdersKey.upload, "lists"] as const,
  subscription: "pendingSubsOrder" as const,
  subsLists: () => [...pendingOrdersKey.subscription, "lists"] as const,
};

export const useGetPendingEventOrder = (userId: string) => {
  return useQuery({
    queryKey: pendingOrdersKey.eventLists(),
    queryFn: async () => {
      const res = await getPendingEventOrder(userId);
      return res;
    },
  });
};

export const useGetPendingResourceOrder = (userId: string) => {
  return useQuery({
    queryKey: pendingOrdersKey.resourceLists(),
    queryFn: async () => {
      const res = await getPendingResourceOrder(userId);
      return res;
    },
  });
};

export const useGetPendingPaidUploadOrder = (userId: string) => {
  return useQuery({
    queryKey: pendingOrdersKey.uploadLists(),
    queryFn: async () => {
      const res = await getPendingPaidUploadOrder(userId);
      return res;
    },
  });
};

export const useGetPendingSubsOrder = (userId: string) => {
  return useQuery({
    queryKey: pendingOrdersKey.subsLists(),
    queryFn: async () => {
      const res = await getPendingSubsOrder(userId);
      return res;
    },
  });
};
