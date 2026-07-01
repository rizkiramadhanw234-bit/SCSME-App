import type { CreateEventRegistrationRequest } from "@/types";
import {
  createEventRegistration,
  getEventRegistrationById,
  getEventRegistrations,
  deleteEventRegistration,
  getQrCodeRegistration,
  getEventRegistrationByUserId,
} from "@/services/eventRegistration.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { pendingOrdersKey } from "./usePendingOrders";

const eventRegistrationKey = {
  eventRegistration: ["eventRegistration"] as const,
  qrCodeRegistration: ["qrCodeRegistration"] as const,
  detail: (id: string) =>
    [...eventRegistrationKey.eventRegistration, id] as const,
  lists: () => [...eventRegistrationKey.eventRegistration, "lists"] as const,
  byUser: (userId: string) =>
    [...eventRegistrationKey.eventRegistration, "user", userId] as const,
};

export const useGetEventRegistrations = () => {
  return useQuery({
    queryKey: eventRegistrationKey.lists(),
    queryFn: async () => {
      const res = await getEventRegistrations();
      return res;
    },
  });
};

export const useGetEventRegistrationById = (id: string) => {
  return useQuery({
    queryKey: eventRegistrationKey.detail(id),
    queryFn: async () => {
      const res = await getEventRegistrationById(id);
      return res;
    },
  });
};

export const useGetEventRegistrationByUserId = (userId: string) => {
  return useQuery({
    queryKey: eventRegistrationKey.lists(),
    queryFn: async () => {
      const res = await getEventRegistrationByUserId(userId);
      return res;
    },
    enabled: !!userId,
  });
};

export const useGetQrCodeRegistration = (id: string) => {
  return useQuery({
    queryKey: eventRegistrationKey.qrCodeRegistration,
    queryFn: async () => {
      const res = await getQrCodeRegistration(id);
      return res;
    },
  });
};

export const useCreateEventRegistration = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateEventRegistrationRequest) => {
      const res = await createEventRegistration(data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: eventRegistrationKey.lists(),
      });
    },
    onError: (error) => console.error(error),
  });
};

export const useDeleteEventRegistration = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await deleteEventRegistration(id);
      return res;
    },
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: eventRegistrationKey.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: eventRegistrationKey.lists() });
      queryClient.invalidateQueries({
        queryKey: pendingOrdersKey.eventLists(),
      });
    },
    onError: (error) => console.error(error),
  });
};
