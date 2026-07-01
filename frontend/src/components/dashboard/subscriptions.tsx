"use client";

import { Card } from "../ui/card";
import { useAuthStore } from "@/stores/auth.store";
import { useGetSubscriptionByUserId } from "@/hooks/useSubscription";
import { useGetMembershipPlanById } from "@/hooks/useMembershipPlans";
import { useGetMembershipPlans } from "@/hooks/useMembershipPlans";
import { dateStringToLocalTime } from "@/utils/formatDate";
import { SpinnerCustom } from "../ui/spinner";
import { formatPrice } from "@/utils/formatPrice";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { MdPayments } from "react-icons/md";
import { FaCircleCheck } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { BsFillPeopleFill } from "react-icons/bs";
import { HiBadgeCheck } from "react-icons/hi";

export default function Subscriptions() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: subscriptionUser, isLoading } = useGetSubscriptionByUserId(
    user?.id ?? "",
  );
  const subscriptionResult = subscriptionUser?.data?.id
    ? subscriptionUser.data
    : null;

  const { data: membershipPlan } = useGetMembershipPlanById(
    subscriptionResult?.planId ?? "",
  );
  const planName = membershipPlan?.planName;

  const { data: membershipPlans, isLoading: isLoadingPlans } =
    useGetMembershipPlans();
  const membershipPlanResult = membershipPlans ?? [];

  const otherPlans = membershipPlanResult.filter(
    (plan) => plan.id !== subscriptionResult?.planId,
  );
  return (
    <>
      <div className="py-2 px-2 mt-4">
        <div className="flex items-center gap-2">
          <HiBadgeCheck className="text-2xl text-blue-950" />
          <h1 className="text-2xl font-bold  text-blue-950">Subscriptions</h1>
        </div>
        <div>
          {/* Subscription */}
          <div className="pt-4">
            <Card className="p-4 flex flex-col justify-centers">
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <SpinnerCustom />
                </div>
              ) : !subscriptionResult ? (
                <div className="flex flex-col gap-2 items-center justify-center">
                  <p className="text-sm text-gray-500">No subscription</p>
                  <Button
                    variant="outline"
                    className="text-xs"
                    onClick={() => router.push("/subscriptions")}
                  >
                    Get a Plan
                  </Button>
                </div>
              ) : (
                <>
                  <div className="p-2 bg-blue-50 text-blue-950 rounded-2xl w-36 flex items-center justify-center">
                    <div className="flex gap-2 items-center">
                      <BsFillPeopleFill />
                      <p className="font-bold">{planName}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 px-3">
                    <div className="flex gap-2 items-center">
                      <MdPayments />
                      <p>
                        Payment Status:{" "}
                        <span className="font-bold">
                          {subscriptionResult?.paymentStatus?.toUpperCase()}
                        </span>
                      </p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <FaCircleCheck />
                      <p>
                        Renewal Status:{" "}
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-600 text-white">
                          {subscriptionResult?.renewalStatus}
                        </span>
                      </p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <FaCalendarAlt />
                      <p>
                        Start Date:{" "}
                        {subscriptionResult?.endDate
                          ? dateStringToLocalTime(subscriptionResult?.startDate)
                          : "N/A"}
                      </p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <FaCalendarAlt />
                      <p>
                        End Date:{" "}
                        {subscriptionResult?.endDate
                          ? dateStringToLocalTime(subscriptionResult?.endDate)
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </Card>
            {/* <div className="relative left-270 -top-50">
              <CancelRegistration />
            </div> */}
          </div>
        </div>

        {/* Available plans */}
        <div className="pt-8 w-full">
          <h2 className="font-bold">Available plans</h2>
          {isLoadingPlans ? (
            <div className="flex items-center justify-center">
              <SpinnerCustom />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {otherPlans.map((plan) => (
                <Card key={plan.id} className="p-4 flex flex-col">
                  <div className="p-2 bg-blue-50 text-blue-950 rounded-2xl w-43 flex items-center justify-center">
                    <div className="flex gap-2 items-center">
                      <BsFillPeopleFill />
                      <p className="font-bold">{plan.planName}</p>
                    </div>
                  </div>

                  <div className="px-2 flex flex-col gap-3">
                    <div className="flex gap-2 items-center">
                      <MdPayments />
                      <p className="font-semibold text-lg">
                        {formatPrice(plan.price)}
                      </p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <FaCalendarAlt />
                      <p>{plan.durationDays} days</p>
                    </div>
                    <p className="text-base">
                      <span className="font-semibold">Benefits:</span>{" "}
                      {plan.benefits}
                    </p>
                  </div>
                  <Button
                    className="w-full h-9  bg-blue-900 hover:bg-blue-950 cursor-pointer"
                    onClick={() =>
                      router.push(`/dashboard/subscriptions/${plan.id}`)
                    }
                  >
                    Subscribe
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
