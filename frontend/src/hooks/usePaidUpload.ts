import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  createPaidUpload,
  updatePaidUpload,
  deletePaidUpload,
  getPaidUploadById,
  getPaidUploadByUserId,
} from "@/services/paidUpload.service";
import { CreatePaidUploadFormData, UpdatePaidUploadFormData } from "@/types";
import { pendingOrdersKey } from "./usePendingOrders";

const paidUploadKeys = {
  paidUpload: ["paidUpload"] as const,
  lists: () => [...paidUploadKeys.paidUpload, "lists"] as const,
  detail: (id: string) => [...paidUploadKeys.paidUpload, "detail", id] as const,
  userId: (userId: string) =>
    [...paidUploadKeys.paidUpload, "userId", userId] as const,
};

export const useCreatePaidUpload = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreatePaidUploadFormData) => {
      const res = await createPaidUpload(data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paidUploadKeys.paidUpload });
    },
    onError: (error) => console.error(error),
  });
};

export const useUpdatePaidUpload = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdatePaidUploadFormData) => {
      const res = await updatePaidUpload(id, data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paidUploadKeys.paidUpload });
    },
    onError: (error) => console.error(error),
  });
};

export const useGetPaidUploadByUserId = (userId: string) => {
  return useQuery({
    queryKey: paidUploadKeys.userId(userId),
    queryFn: async () => {
      const res = await getPaidUploadByUserId(userId);
      return res;
    },
    enabled: !!userId,
  });
};

export const useGetPaidUploadById = (id: string) => {
  return useQuery({
    queryKey: paidUploadKeys.detail(id),
    queryFn: async () => {
      const res = await getPaidUploadById(id);
      return res;
    },
    enabled: !!id,
  });
};

export const useDeletePaidUploads = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => await deletePaidUpload(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paidUploadKeys.paidUpload });
      queryClient.invalidateQueries({
        queryKey: pendingOrdersKey.uploadLists(),
      });
    },
    onError: (error) => console.error(error),
  });
};
