"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/auth.store";
import { useCreatePayment } from "@/hooks/usePayment";
import { CreatePaymentFormData } from "@/types";
import { useState, useEffect } from "react";

type PaymentModalProps = {
  orderCode: string;
  orderType: string;
  amount: number;
};

export default function PaymentModal({
  orderCode,
  orderType,
  amount,
}: PaymentModalProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { user } = useAuthStore();
  const { mutateAsync: createPayment } = useCreatePayment();
  const [formData, setFormData] = useState<CreatePaymentFormData>({
    userId: "",
    orderCode: "",
    orderType: "",
    amount: 0 || "",
    proofUrl: new File([], ""),
  });

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData((prev) => ({
        ...prev,
        userId: user.id,
        orderCode: orderCode,
        orderType: orderType,
        amount: amount,
      }));
    }
  }, [user, orderCode, orderType, amount]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, proofUrl: file }));
    }
  };

  const handleSubmit = async () => {
    try {
      await createPayment(formData);
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <form>
            <DialogTrigger
              render={
                <Button variant="outline" className="w-full border-0 text-left">
                  Pay Now
                </Button>
              }
            />
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Confirm Payment</DialogTitle>
                <DialogDescription>
                  Confirm payment for order code: {orderCode}
                </DialogDescription>
              </DialogHeader>
              <FieldGroup>
                <Field>
                  <Label htmlFor="orderCode">Order Code</Label>
                  <Input
                    id="orderCode"
                    name="orderCode"
                    defaultValue={orderCode}
                    readOnly
                  />
                </Field>
                <Field>
                  <Label htmlFor="orderType">Order Type</Label>
                  <Input
                    id="orderType"
                    name="orderType"
                    defaultValue={orderType}
                    readOnly
                  />
                </Field>
                <Field>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    name="amount"
                    defaultValue={amount}
                    readOnly
                  />
                </Field>
                <Field>
                  <Label htmlFor="proofUrl">Upload Proof</Label>
                  <Input
                    id="proofUrl"
                    name="proofUrl"
                    type="file"
                    onChange={handleFileChange}
                  />
                </Field>
              </FieldGroup>
              <DialogFooter>
                <DialogClose
                  render={<Button variant="outline">Cancel</Button>}
                />
                <Button onClick={handleSubmit}>Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </div>
    </>
  );
}
