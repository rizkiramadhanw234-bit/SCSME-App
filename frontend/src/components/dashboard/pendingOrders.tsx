"use client";
import { MoreHorizontalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuthStore } from "@/stores/auth.store";
import {
  useGetPendingEventOrder,
  useGetPendingPaidUploadOrder,
  useGetPendingResourceOrder,
  useGetPendingSubsOrder,
} from "@/hooks/usePendingOrders";
import { FaCalendarCheck } from "react-icons/fa";
import { SpinnerCustom } from "../ui/spinner";
import PaymentModal from "../modals/paymentModal";
import EventsRegistrationDelete from "../modals/eventsRegistrationDelete";
import DeletePaidUploads from "../modals/paidUploadsDelete";
import ResourcePurchaseDelete from "../modals/resourcePurchaseDelete";
import SubsDelete from "../modals/subscriptionDelete";

export default function PendingOrders() {
  const { user } = useAuthStore();

  const { data: pendingEventOrder, isLoading: isLoadingEvent } =
    useGetPendingEventOrder(user?.id ?? "");

  const { data: pendingPaidUploadOrder, isLoading: isLoadingUpload } =
    useGetPendingPaidUploadOrder(user?.id ?? "");

  const { data: pendingResourceOrder, isLoading: isLoadingResource } =
    useGetPendingResourceOrder(user?.id ?? "");

  const { data: pendingSubsOrder, isLoading: isLoadingSub } =
    useGetPendingSubsOrder(user?.id ?? "");

  const totalAllPendingOrders = () => {
    return (
      (pendingEventOrder?.length ?? 0) +
      (pendingPaidUploadOrder?.length ?? 0) +
      (pendingResourceOrder?.length ?? 0) +
      (pendingSubsOrder?.length ?? 0)
    );
  };

  const loading =
    isLoadingEvent || isLoadingUpload || isLoadingResource || isLoadingSub;
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <SpinnerCustom />
      </div>
    );
  }

  const hasNoOrders = totalAllPendingOrders() === 0;

  return (
    <>
      <div className="py-2 px-2 mt-4">
        <div className="flex gap-2">
          <FaCalendarCheck className="text-2xl text-blue-950 mt-0.5" />
          <h1 className="text-2xl md:text-2xl font-bold text-blue-950 pb-5">
            Pending Orders : <span>{totalAllPendingOrders()}</span>
          </h1>
        </div>

        {/* empty no orders */}
        {hasNoOrders && (
          <div className="flex flex-col items-center justify-center text-center py-16 px-4">
            <FaCalendarCheck className="text-5xl text-blue-200 mb-4" />
            <h1 className="text-xl md:text-2xl font-bold text-blue-950">
              No Orders
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              You don&apos;t have any pending orders at the moment.
            </p>
          </div>
        )}

        {/* event registration */}
        {(pendingEventOrder?.length ?? 0) > 0 && (
          <div>
            <div className="flex items-center justify-between border-t py-1 pb-2">
              <h3 className="text-blue-950 font-semibold text-sm">
                Event Registration
              </h3>
              <p className="text-sm">
                Pending Orders {pendingEventOrder?.length ?? 0}
              </p>
            </div>
            <Table>
              <TableHeader className="bg-blue-50">
                <TableRow>
                  <TableHead className="w-[270px]">Title</TableHead>
                  <TableHead className="w-[270px]">Order Code</TableHead>
                  <TableHead className="w-[270px]">Price</TableHead>
                  <TableHead className="w-[270px]">Payment Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {pendingEventOrder?.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      {order.event?.title}
                    </TableCell>
                    <TableCell>{order.orderCode}</TableCell>
                    <TableCell>{order.event?.price}</TableCell>
                    <TableCell>{order.paymentStatus}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                            >
                              <MoreHorizontalIcon />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end">
                          <PaymentModal
                            orderCode={order.orderCode}
                            orderType="event"
                            amount={Number(order.event?.price) ?? 0}
                          />
                          <DropdownMenuSeparator />
                          <EventsRegistrationDelete id={order.id} />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* subscription */}
        {(pendingSubsOrder?.length ?? 0) > 0 && (
          <div>
            <div className="pt-4">
              <div className="flex items-center justify-between border-t py-1 pb-2">
                <h3 className="text-blue-950 font-semibold">Subscription</h3>
                <p className="text-sm">
                  Pending Orders {pendingSubsOrder?.length ?? 0}
                </p>
              </div>
            </div>
            <Table>
              <TableHeader className="bg-blue-50">
                <TableRow>
                  <TableHead className="w-[270px]">Plan Name</TableHead>
                  <TableHead className="w-[270px]">Order Code</TableHead>
                  <TableHead className="w-[270px]">Price</TableHead>
                  <TableHead className="w-[270px]">Payment Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingSubsOrder?.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      {order.plan?.planName}
                    </TableCell>
                    <TableCell>{order.orderCode}</TableCell>
                    <TableCell>{order.plan?.price}</TableCell>
                    <TableCell>{order.paymentStatus}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                            >
                              <MoreHorizontalIcon />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end">
                          <PaymentModal
                            orderCode={order.orderCode}
                            orderType="membership"
                            amount={Number(order.plan?.price) ?? 0}
                          />
                          <DropdownMenuSeparator />
                          <SubsDelete id={order.id} />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* paid upload */}
        {(pendingPaidUploadOrder?.length ?? 0) > 0 && (
          <div>
            <div className="pt-4">
              <div className="flex items-center justify-between border-t py-1 pb-2">
                <h3 className="text-blue-950 font-semibold">Paid Uploads</h3>
                <p className="text-sm">
                  Pending Orders {pendingPaidUploadOrder?.length ?? 0}
                </p>
              </div>
            </div>
            <Table>
              <TableHeader className="bg-blue-50">
                <TableRow>
                  <TableHead className="w-[270px]">Upload Type</TableHead>
                  <TableHead className="w-[270px]">Order Code</TableHead>
                  <TableHead className="w-[270px]">Price</TableHead>
                  <TableHead className="w-[270px]">Payment Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingPaidUploadOrder?.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      {order.uploadType}
                    </TableCell>
                    <TableCell>{order.orderCode}</TableCell>
                    <TableCell>{order.price}</TableCell>
                    <TableCell>{order.paymentStatus}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                            >
                              <MoreHorizontalIcon />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end">
                          <PaymentModal
                            orderCode={order.orderCode}
                            orderType="paid_upload"
                            amount={Number(order.price) ?? 0}
                          />
                          <DropdownMenuSeparator />
                          <DeletePaidUploads id={order.id} />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Resource purchases */}
        {(pendingResourceOrder?.length ?? 0) > 0 && (
          <div>
            <div className="pt-4">
              <div className="flex items-center justify-between border-t py-1 pb-2">
                <h3 className="text-blue-950 font-semibold">
                  Resource Purchases
                </h3>
                <p className="text-sm">
                  Pending Orders: {pendingResourceOrder?.length ?? 0}
                </p>
              </div>
            </div>
            <Table>
              <TableHeader className="bg-blue-50">
                <TableRow>
                  <TableHead className="w-[270px]">Title</TableHead>
                  <TableHead className="w-[270px]">Order Code</TableHead>
                  <TableHead className="w-[270px]">Price</TableHead>
                  <TableHead className="w-[270px]">Payment Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingResourceOrder?.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      {order.resource?.title}
                    </TableCell>
                    <TableCell>{order.orderCode}</TableCell>
                    <TableCell>{order.resource?.price}</TableCell>
                    <TableCell>{order.paymentStatus}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                            >
                              <MoreHorizontalIcon />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end">
                          <PaymentModal
                            orderCode={order.orderCode}
                            orderType="resource"
                            amount={Number(order.resource?.price) ?? 0}
                          />
                          <DropdownMenuSeparator />
                          <ResourcePurchaseDelete id={order.id} />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
}
