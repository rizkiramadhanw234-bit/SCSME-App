import { useQuery } from "@tanstack/react-query";
import {
  getMembershipPlans,
  getMembershipPlanById,
} from "@/services/membership.service";

const membershipPlansKey = {
  membershipPlans: ["membershipPlans"] as const,
  detail: (id: string) =>
    [...membershipPlansKey.membershipPlans, "detail", id] as const,
};

export const useGetMembershipPlans = () => {
  return useQuery({
    queryKey: membershipPlansKey.membershipPlans,
    queryFn: async () => {
      const res = await getMembershipPlans();
      return res;
    },
  });
};

export const useGetMembershipPlantById = (id: string) => {
  return useQuery({
    queryKey: membershipPlansKey.detail(id),
    queryFn: async () => {
      const res = await getMembershipPlanById(id);
      return res;
    },
  });
};
