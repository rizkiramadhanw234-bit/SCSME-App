import { createResourcePurchase } from "@/services/resourcePurchases.service";
import { CreateResourcePurchaseRequest } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const resourcePurchasesKey = {
  resourcePurchases: ["resourcePurchases"] as const,
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
        queryKey: resourcePurchasesKey.resourcePurchases,
      });
    },
    onError: (error) => console.error(error),
  });
};
