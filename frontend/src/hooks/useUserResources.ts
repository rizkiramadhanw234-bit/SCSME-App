import {
  getPublicUserResources,
  getPaidUserResourcesLevel,
  getPaidResources,
} from "@/services/userResources.services";
import { useQuery } from "@tanstack/react-query";

const userResourcesKey = {
  publicUserResources: ["publicUserResources"] as const,
  activeUserResources: ["activeUserResources"] as const,
  downloadResources: ["downloadResources"] as const,
  paidResources: ["paidResources"] as const,
};

export const useGetPublicUserResources = () => {
  return useQuery({
    queryKey: userResourcesKey.publicUserResources,
    queryFn: async () => {
      const res = await getPublicUserResources();
      return res;
    },
  });
};

export const useGetLevelUserResources = (userId: string) => {
  return useQuery({
    queryKey: userResourcesKey.activeUserResources,
    queryFn: async () => {
      const res = await getPaidUserResourcesLevel(userId);
      return res;
    },
  });
};

// paid resources
export const useGetPaidResources = () => {
  return useQuery({
    queryKey: userResourcesKey.paidResources,
    queryFn: async () => {
      const res = await getPaidResources();
      return res;
    },
  });
};
