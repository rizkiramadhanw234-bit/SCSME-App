import { useQuery } from "@tanstack/react-query";
import { getResourceById } from "@/services/resource.service";

const resourceKey = { resource: ["resource"] as const };

export const useGetResourceById = (id: string) => {
  return useQuery({
    queryKey: resourceKey.resource,
    queryFn: async () => {
      const res = await getResourceById(id);
      return res;
    },
  });
};
