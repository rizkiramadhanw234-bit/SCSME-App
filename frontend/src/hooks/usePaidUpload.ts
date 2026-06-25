import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  createPaidUpload,
  updatePaidUpload,
  deletePaidUpload,
  getPaidUploadById,
} from "@/services/paidUpload.service";
import {
  CreatePaidUploadFormData,
  UpdatePaidUploadFormData,
  PaidUpload,
} from "@/types";

const paidUploadKeys = {
  data: ["paidUpload"] as const,
  detail: (id: string) => [...paidUploadKeys.data, "detail", id] as const,
  lists: () => [...paidUploadKeys.data, "lists"] as const,
};

export const useCreatePaidUpload = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreatePaidUploadFormData) =>
      await createPaidUpload(data),
    onSuccess: (newData) => {
      queryClient.setQueryData(
        paidUploadKeys.lists(),
        (old: PaidUpload[] | null) => {
          if (!old) return [newData];
          return [...old, newData];
        },
      );
      queryClient.invalidateQueries({ queryKey: paidUploadKeys.lists() });
    },
    onError: (error) => console.error(error),
  });
};

export const useUpdatePainUpload = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdatePaidUploadFormData) =>
      await updatePaidUpload(data.id, data),

    onSuccess: (newData) => {
      queryClient.setQueryData(
        paidUploadKeys.lists(),
        (old: PaidUpload[] | null) => {
          if (!old) return [newData];
          return [...old, newData];
        },
      );
      queryClient.invalidateQueries({ queryKey: paidUploadKeys.lists() });
    },
    onError: (error) => console.error(error),
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
      queryClient.invalidateQueries({ queryKey: paidUploadKeys.lists() });
    },
    onError: (error) => console.error(error),
  });
};
