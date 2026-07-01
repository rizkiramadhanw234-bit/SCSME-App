"use client";

import { useCreateResourcePurchases } from "@/hooks/useResourcePurchases";
import { useGetResourceById } from "@/hooks/useResource";
import { useAuthStore } from "@/stores/auth.store";
import { CreateResourcePurchaseRequest } from "@/types";
import { useState, useEffect } from "react";

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

interface ResourcePurchasesModalProps {
  resourceId: string;
}

export default function ResourcePurchasesModal({
  resourceId,
}: ResourcePurchasesModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthStore();
  const {
    mutateAsync: createResourcePurchases,
    isPending,
    isSuccess,
  } = useCreateResourcePurchases();

  const { data: getResourceId } = useGetResourceById(resourceId);

  const [resourcePurchases, setResourcePurchases] =
    useState<CreateResourcePurchaseRequest>({
      userId: user?.id || "",
      resourceId: resourceId,
    });

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResourcePurchases({
        userId: user?.id || "",
        resourceId: resourceId,
      });
    }
  }, [user, resourceId]);

  const handleSubmit = async () => {
    try {
      await createResourcePurchases(resourcePurchases);
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      alert("Already Purchased");
      setIsOpen(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <form>
          <DialogTrigger
            render={
              <Button variant="outline" disabled={isSuccess}>
                {isSuccess ? "Purchased" : "Purchase"}
              </Button>
            }
          />
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>New Resources</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <DialogClose render={<Button variant="outline">Cancel</Button>} />
              <Button type="submit" onClick={handleSubmit}>
                {isPending ? "Loading..." : "Confirm"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
}
