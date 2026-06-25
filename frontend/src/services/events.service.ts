import { axiosApi } from "./axios";
import { Event } from "@/types";

export const getEvents = async () => {
  const res = await axiosApi.get<{ data: Event[] }>("/event");
  return res.data.data;
};

export const getEventById = async (id: string) => {
  const res = await axiosApi.get<{ data: Event }>(`/event/${id}`);
  return res.data.data;
};
