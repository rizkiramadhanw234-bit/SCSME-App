import type {
  CreateSubscriptionRequest,
  UpgradeSubscriptionRequest,
} from "@/types";
import {
  createSubscription,
  deleteSubscription,
  getSubscriptionById,
  upgradeSubscription,
  getSubscriptionByUserId,
} from "@/services/subscription.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const subscriptionKey = {
  subscriptions: ["subscriptions"] as const,
  detail: (id: string) => [...subscriptionKey.subscriptions, id] as const,
  lists: () => [...subscriptionKey.subscriptions, "lists"] as const,
  userId: (userId: string) =>
    [...subscriptionKey.subscriptions, userId] as const,
};

export const useGetSubscriptionByUserId = (userId: string) => {
  return useQuery({
    queryKey: subscriptionKey.userId(userId),
    queryFn: async () => {
      const res = await getSubscriptionByUserId(userId);
      return res;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 1,
  });
};

export const useGetSubscriptionById = (id: string) => {
  return useQuery({
    queryKey: subscriptionKey.detail(id),
    queryFn: async () => {
      const res = await getSubscriptionById(id);
      return res;
    },
  });
};

export const useCreateSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateSubscriptionRequest) => {
      const res = await createSubscription(data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKey.lists() });
    },
    onError: (error) => console.error(error),
  });
};

export const useUpgradeSubscription = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpgradeSubscriptionRequest) => {
      const res = await upgradeSubscription(id, data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKey.lists() });
    },
    onError: (error) => console.error(error),
  });
};

export const useDeleteSubscription = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => await deleteSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKey.lists() });
    },
    onError: (error) => console.error(error),
  });
};
