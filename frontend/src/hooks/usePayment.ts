import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPayment,
  getPaymentById,
  getPaymentByUserId,
} from "@/services/payment.service";
import type { CreatePaymentFormData } from "@/types";

const paymentKeys = {
  payment: ["payment"] as const,
  lists: () => [...paymentKeys.payment, "lists"] as const,
  detail: (id: string) => [...paymentKeys.payment, "detail", id] as const,
  byUserId: (userId: string) =>
    [...paymentKeys.payment, "byUserId", userId] as const,
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreatePaymentFormData) =>
      await createPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
    },
    onError: (error) => console.error(error),
  });
};

export const useGetPaymentById = (id: string) => {
  return useQuery({
    queryKey: paymentKeys.detail(id),
    queryFn: async () => {
      const res = await getPaymentById(id);
      return res;
    },
    enabled: !!id,
  });
};

export const useGetPaymentByUserId = (userId: string) => {
  return useQuery({
    queryKey: paymentKeys.byUserId(userId),
    queryFn: async () => {
      const res = await getPaymentByUserId(userId);
      return res;
    },
    enabled: !!userId,
  });
};
