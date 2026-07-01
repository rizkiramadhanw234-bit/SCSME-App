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
import { useState, useEffect } from "react";
import { useCreateSubscription } from "@/hooks/useSubscription";
import { useGetMembershipPlanById } from "@/hooks/useMembershipPlans";
import type { CreateSubscriptionRequest } from "@/types";
import { useAuthStore } from "@/stores/auth.store";

type SubsProps = {
  planId: string;
};

export default function SubsModal({ planId }: SubsProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { user } = useAuthStore();
  const { data: plan } = useGetMembershipPlanById(planId);
  const { mutateAsync: createSubscription, isPending } =
    useCreateSubscription();

  const [subscription, setSubscription] = useState<CreateSubscriptionRequest>({
    userId: user?.id || "",
    planId: planId,
  });

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSubscription({
        userId: user?.id || "",
        planId: planId,
      });
    }
  }, [user, planId]);

  const handleSubmit = async () => {
    try {
      await createSubscription(subscription);
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
              render={<Button variant="outline">Subscribe</Button>}
            />
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Confirm Subscription</DialogTitle>
                <DialogDescription>
                  Are you sure you want to subscribe to this plan?
                </DialogDescription>
              </DialogHeader>
              <FieldGroup>
                <Field>
                  <Label htmlFor="planId">Membership Plan</Label>
                  <Input
                    id="planId"
                    name="planId"
                    defaultValue={plan?.planName}
                    readOnly
                  />
                </Field>
                <Field>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    name="price"
                    defaultValue={plan?.price}
                    readOnly
                  />
                </Field>
                <Field>
                  <Label htmlFor="durationDays">Duration</Label>
                  <Input
                    id="durationDays"
                    name="durationDays"
                    defaultValue={`${plan?.durationDays} days`}
                    readOnly
                  />
                </Field>
              </FieldGroup>
              <DialogFooter>
                <DialogClose
                  render={<Button variant="outline">Cancel</Button>}
                />
                <Button type="submit" onClick={handleSubmit}>
                  {isPending ? "Loading..." : "Confirm"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </div>
    </>
  );
}
