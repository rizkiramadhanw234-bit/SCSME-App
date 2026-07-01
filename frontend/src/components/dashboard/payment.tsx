"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetPaymentByUserId } from "@/hooks/usePayment";
import { useAuthStore } from "@/stores/auth.store";
import { formatPrice } from "@/utils/formatPrice";
import { useRouter } from "next/navigation";
import { SpinnerCustom } from "../ui/spinner";
import { FaCalendarCheck } from "react-icons/fa";

export default function PaymentPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: paymentUser, isLoading } = useGetPaymentByUserId(
    user?.id ?? "",
  );
  const paymentResult = paymentUser?.slice(0, 3) ?? [];
  return (
    <div className="py-2 px-2 mt-4">
      <div className="flex gap-2">
        <FaCalendarCheck className="text-2xl text-blue-950 mt-0.5" />
        <h1 className="text-2xl md:text-2xl font-bold text-blue-950 pb-5">
          Payments
        </h1>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center">
          <SpinnerCustom />
        </div>
      ) : (
        <div>
          <Table className="bg-white">
            <TableCaption>A list of your recent payments.</TableCaption>
            <TableHeader className="bg-blue-50">
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Order Code</TableHead>
                <TableHead>Order Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Proof</TableHead>
                <TableHead>Payment Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <>
                {paymentResult.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No payments found
                    </TableCell>
                  </TableRow>
                )}
              </>
              {paymentResult.map((payment) => (
                <TableRow
                  key={payment.id}
                  onClick={() => router.push(`/payment/${payment.id}`)}
                  className="cursor-pointer "
                >
                  <TableCell>{payment.paymentCode}</TableCell>
                  <TableCell>{payment.orderCode}</TableCell>
                  <TableCell>{payment.orderType ?? "N/A"}</TableCell>
                  <TableCell>{formatPrice(payment.amount) ?? "N/A"}</TableCell>
                  {payment.proofUrl?.length === 0 ? (
                    <TableCell>N/A</TableCell>
                  ) : (
                    payment.proofUrl && (
                      <TableCell>
                        <img
                          src={payment.proofUrl}
                          alt="Proof"
                          width={50}
                          height={50}
                        />
                      </TableCell>
                    )
                  )}
                  <TableCell
                    className={
                      payment?.paymentStatus.includes("paid")
                        ? "text-green-600"
                        : payment?.paymentStatus.includes("failed")
                          ? "text-red-600"
                          : payment?.paymentStatus.includes("refunded")
                            ? "text-red-600"
                            : payment?.paymentStatus.includes("pending")
                              ? "text-yellow-600"
                              : "N/A"
                    }
                  >
                    {payment.paymentStatus.toUpperCase() ?? "N/A"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
