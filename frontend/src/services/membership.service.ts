import { axiosApi } from "./axios";
import type { MembershipPlan } from "@/types";

export const getMembershipPlans = async () => {
  const res = await axiosApi.get<{ data: MembershipPlan[] }>(
    "/membership-plans",
  );
  return res.data.data;
};

export const getMembershipPlanById = async (id: string) => {
  const res = await axiosApi.get<{ data: MembershipPlan }>(
    `/membership-plans/${id}`,
  );
  return res.data.data;
};
