"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { useDeleteResourcePurchases } from "@/hooks/useResourcePurchases";
import { useState } from "react";

type DeleteProps = {
  id: string;
};

export default function ResourcePurchaseDelete({ id }: DeleteProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { mutateAsync: deleteResource, isPending } =
    useDeleteResourcePurchases(id);

  const handleDelete = async () => {
    try {
      await deleteResource();
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <div>
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger
            render={<Button variant="destructive" className="w-full" />}
          >
            Delete
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                {isPending ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
