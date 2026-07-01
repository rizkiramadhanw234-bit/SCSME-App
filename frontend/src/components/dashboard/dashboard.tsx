"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BsFillPeopleFill } from "react-icons/bs";
import { FaCalendarAlt, FaDownload, FaFileAlt } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import { IoLocationSharp } from "react-icons/io5";
import { MdPayments, MdSpaceDashboard } from "react-icons/md";
import { useGetEvents } from "@/hooks/useEvent";
import { useGetEventRegistrationByUserId } from "@/hooks/useEventRegistration";
import { useGetSubscriptionByUserId } from "@/hooks/useSubscription";
import { useGetLevelUserResources } from "@/hooks/useUserResources";
import { useAuthStore } from "@/stores/auth.store";
import { dateStringToLocalTime } from "@/utils/formatDate";
import RecentPayments from "./recentPayments";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { SpinnerCustom } from "../ui/spinner";
import EventsRegistrationModal from "../modals/eventsRegistrationModal";

export default function DashboardPage() {
  const router = useRouter();

  const { user } = useAuthStore();
  const { data: subscriptionUser, isLoading: isLoadingSubsByUserId } =
    useGetSubscriptionByUserId(user?.id ?? "");

  const subscriptionResult = subscriptionUser?.data ?? null;

  const { data: eventRegistrationUserId, isLoading: isLoadingRegisUserId } =
    useGetEventRegistrationByUserId(user?.id ?? "") ?? null;

  const { data: events, isLoading: isLoadingEvents } = useGetEvents();
  const eventsResult = events ?? [];

  const otherEvents = eventsResult
    .filter(
      (event) => !eventRegistrationUserId?.find((e) => e.eventId === event.id),
    )
    .slice(0, 3);

  const { data: resources, isLoading: isLoadingResourcesPaid } =
    useGetLevelUserResources(user?.id ?? "");

  return (
    <div className="py-2 px-2 mt-4">
      <div className="flex items-center gap-2">
        <MdSpaceDashboard className="text-2xl text-blue-950" />
        <h1 className="text-2xl font-bold text-blue-950">Dashboard</h1>
      </div>
      <div className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-center w-full">
          {/* Subscription status */}
          {isLoadingSubsByUserId ? (
            <Card className="p-4 h-50 flex items-center justify-center">
              <SpinnerCustom />
            </Card>
          ) : !subscriptionUser ? (
            <Card className="p-4 h-50 flex flex-col items-center justify-center gap-3">
              <FaCircleCheck className="text-4xl text-gray-300" />
              <p className="text-gray-500 text-sm">No active subscription</p>
              <Button
                variant="outline"
                className="text-xs"
                onClick={() => router.push("/subscriptions")}
              >
                Get a Plan
              </Button>
            </Card>
          ) : (
            <Card className="p-4 h-50">
              <p className="font-bold text-lg">Subscription</p>
              <div className="flex flex-col gap-3">
                <div className="flex gap-2 items-center">
                  <FaCircleCheck />
                  <p>
                    Renewal Status:{" "}
                    <span
                      className={
                        subscriptionResult?.renewalStatus?.includes("expired")
                          ? "bg-red-600 text-white px-2 py-0.5 rounded-full"
                          : subscriptionResult?.renewalStatus?.includes(
                                "cancelled",
                              )
                            ? "bg-red-600 text-white px-2 py-0.5 rounded-full"
                            : "bg-green-600 text-white px-2 py-0.5 rounded-full"
                      }
                    >
                      {subscriptionResult?.renewalStatus ?? "N/A"}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <BsFillPeopleFill />
                  <p>
                    Plan Name:{" "}
                    {subscriptionResult?.plan?.planName ?? "N/A"}{" "}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <MdPayments />
                  <p>
                    Payment Status:{" "}
                    {subscriptionResult?.paymentStatus ?? "N/A"}{" "}
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
            </Card>
          )}

          {/* events joined */}
          {isLoadingRegisUserId ? (
            <Card className="p-4 h-50 flex items-center justify-center">
              <SpinnerCustom />
            </Card>
          ) : (
            <Card className="p-4 h-50">
              <p className="font-bold text-lg">Events Joined</p>
              <div className="flex flex-col gap-4">
                <div className="flex gap-2 items-center">
                  <BsFillPeopleFill />
                  <p className="text-xl font-semibold">
                    {eventRegistrationUserId?.length} / {eventsResult.length}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <FaCalendarAlt />
                  <p className="">
                    Other Events:{" "}
                    <span className="font-bold">{eventsResult.length}</span>
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* resources access */}
          {isLoadingResourcesPaid ? (
            <Card className="p-4 h-50 flex items-center justify-center">
              <SpinnerCustom />
            </Card>
          ) : (
            <Card className="p-4 h-50">
              <p className="font-bold text-lg">Resources Access</p>
              <div className="flex flex-col gap-4">
                <div className="flex gap-2 items-center">
                  <FaFileAlt />
                  <p className="text-xl font-semibold">
                    {resources?.length} items
                  </p>
                </div>

                <div className="flex gap-2 items-center">
                  <FaDownload />
                  <p>
                    {
                      resources?.filter(
                        (filtered) => filtered.accessLevel.length > 0,
                      ).length
                    }{" "}
                    Paid Downloads
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* other events */}
        <div className="pt-8 items-center justify-center w-full">
          <div className="flex items-center justify-between">
            <p className="font-semibold pb-2">Other Events</p>
            <Link
              href="/eventRegistration"
              className="text-xs cursor-pointer underline underline-offset-5 text-blue-900 hover:text-blue-950"
            >
              See All Events
            </Link>
          </div>
          {isLoadingEvents ? (
            <Card className="p-4 h-40 flex items-center justify-center">
              <SpinnerCustom />
            </Card>
          ) : (
            <>
              {otherEvents.length === 0 && (
                <Card className="p-4 h-40 flex items-center justify-center">
                  <p className="text-sm text-gray-500">No other events</p>
                </Card>
              )}

              <div className="grid md:grid-cols-3 gap-4">
                {otherEvents.map((data) => (
                  <Card key={data.id} className="md:h-full h-full px-6 py-4">
                    <div className="flex flex-col justify-center items-start gap-2">
                      <div>
                        <img
                          src={data.coverImage ?? ""}
                          alt={data.title}
                          width={100}
                          height={100}
                          className="w-full h-40 object-cover"
                        />
                      </div>
                      <p className="text-base md:text-lg font-bold">
                        {data.title}
                      </p>

                      <div className="flex gap-2 items-start">
                        <FaCalendarAlt />
                        <p>{dateStringToLocalTime(data.eventDate)}</p>
                      </div>

                      <div className="flex gap-2 items-start">
                        <IoLocationSharp />
                        <p>{data.location}</p>
                      </div>

                      <div className="flex gap-2 items-start">
                        <BsFillPeopleFill />
                        <p className="pb-3">About {data.capacity} people</p>
                      </div>

                      <EventsRegistrationModal eventId={data.id} />
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Recent payments */}
        <div className="pt-8 items-center justify-center w-full">
          <div className="pb-2 flex items-center justify-between">
            <p className="font-semibold">Recent payments</p>
            <Link
              href="/payments"
              className="text-xs cursor-pointer underline underline-offset-5 text-blue-900 hover:text-blue-950"
            >
              See All Payments
            </Link>
          </div>
          <RecentPayments />
        </div>
      </div>
    </div>
  );
}
