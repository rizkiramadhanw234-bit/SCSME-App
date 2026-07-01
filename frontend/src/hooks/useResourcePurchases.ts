import {
  createResourcePurchase,
  getResourcePurchaseById,
  deleteResourcePurchases,
} from "@/services/resourcePurchases.service";
import { CreateResourcePurchaseRequest } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { pendingOrdersKey } from "./usePendingOrders";

const resourcePurchasesKey = {
  resourcePurchases: ["resourcePurchases"] as const,
  lists: () => [...resourcePurchasesKey.resourcePurchases, "lists"] as const,
};

export const useCreateResourcePurchases = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateResourcePurchaseRequest) => {
      const res = await createResourcePurchase(data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: resourcePurchasesKey.lists(),
      });
    },
    onError: (error) => console.error(error),
  });
};

export const useGetResourceById = (id: string) => {
  return useQuery({
    queryKey: resourcePurchasesKey.resourcePurchases,
    queryFn: async () => {
      const res = await getResourcePurchaseById(id);
      return res;
    },
    enabled: !!id,
  });
};

export const useDeleteResourcePurchases = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => await deleteResourcePurchases(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: resourcePurchasesKey.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: pendingOrdersKey.resourceLists(),
      });
    },
    onError: (error) => console.error(error),
  });
};
