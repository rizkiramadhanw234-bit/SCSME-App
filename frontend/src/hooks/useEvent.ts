import { useQuery } from "@tanstack/react-query";
import { getEvents, getEventById } from "@/services/events.service";

const eventsKey = {
  events: ["events"] as const,
  list: () => [...eventsKey.events, "list"] as const,
  detail: (id: string) => [...eventsKey.events, "detail", id] as const,
};

export const useGetEvents = () => {
  return useQuery({
    queryKey: eventsKey.list(),
    queryFn: async () => {
      const res = await getEvents();
      return res;
    },
  });
};

export const useGetEventById = (id: string) => {
  return useQuery({
    queryKey: eventsKey.detail(id),
    queryFn: async () => {
      const res = await getEventById(id);
      return res;
    },
  });
};
