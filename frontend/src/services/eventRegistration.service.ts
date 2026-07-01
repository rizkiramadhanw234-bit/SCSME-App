import { axiosApi } from "./axios";
import type {
  EventRegistration,
  CreateEventRegistrationRequest,
} from "@/types";

export const getEventRegistrations = async () => {
  const res = await axiosApi.get<{ data: EventRegistration[] }>(
    "/event-registration",
  );
  return res.data.data;
};

export const getEventRegistrationById = async (id: string) => {
  const res = await axiosApi.get<{ data: EventRegistration }>(
    `/event-registration/${id}`,
  );
  return res.data.data;
};

export const getEventRegistrationByUserId = async (userId: string) => {
  const res = await axiosApi.get<{
    data: EventRegistration[];
  }>(`/event-registration/user/${userId}`);
  return res.data.data;
};

export const getQrCodeRegistration = async (id: string) => {
  const res = await axiosApi.get<{ data: EventRegistration }>(
    `/event-registration/qrcode/${id}`,
  );
  return res.data.data;
};

export const createEventRegistration = async (
  data: CreateEventRegistrationRequest,
) => {
  const res = await axiosApi.post<{ data: EventRegistration }>(
    "/event-registration/create",
    data,
  );
  return res.data.data;
};

export const deleteEventRegistration = async (id: string) => {
  const res = await axiosApi.delete<{ data: EventRegistration }>(
    `/event-registration/delete/${id}`,
  );
  return res.data.data;
};
