"use client";
import { useDeleteCompany } from "@/hooks/useCompany";
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
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { Company } from "@/types";

type DeleteModalProps = {
  data: Company | null;
};
export default function DeleteModal({ data }: DeleteModalProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { mutateAsync: deleteCompany, isPending } = useDeleteCompany(
    data?.id as string,
  );

  const handleDelete = async () => {
    try {
      if (data?.id) {
        await deleteCompany();
      }
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger
          render={
            <Button
              variant="outline"
              className="bg-red-600 hover:bg-red-500 text-white hover:text-white"
            >
              Delete
            </Button>
          }
        />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account from our servers.
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
    </>
  );
}
