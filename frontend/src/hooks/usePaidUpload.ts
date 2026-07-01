import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  createPaidUpload,
  updatePaidUpload,
  deletePaidUpload,
  getPaidUploadById,
  getPaidUploadByUserId,
} from "@/services/paidUpload.service";
import { CreatePaidUploadFormData, UpdatePaidUploadFormData } from "@/types";

const paidUploadKeys = {
  data: ["paidUpload"] as const,
  detail: (id: string) => [...paidUploadKeys.data, "detail", id] as const,
  lists: () => [...paidUploadKeys.data, "lists"] as const,
  userId: (userId: string) =>
    [...paidUploadKeys.data, "userId", userId] as const,
};

export const useCreatePaidUpload = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreatePaidUploadFormData) => {
      const res = await createPaidUpload(data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paidUploadKeys.data });
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
      queryClient.invalidateQueries({ queryKey: paidUploadKeys.data });
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
      queryClient.invalidateQueries({ queryKey: paidUploadKeys.data });
    },
    onError: (error) => console.error(error),
  });
};
