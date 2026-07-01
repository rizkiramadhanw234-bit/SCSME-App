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
import { useDeletePaidUploads } from "@/hooks/usePaidUpload";
import { useState } from "react";

type DeletePaidUploadsProps = {
  id: string;
};

export default function DeletePaidUploads({ id }: DeletePaidUploadsProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { mutateAsync: deletePaidUploads, isPending } =
    useDeletePaidUploads(id);

  const handleDelete = async () => {
    try {
      await deletePaidUploads();
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger>
          <div className="px-2 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white hover:text-white">
            Delete
          </div>
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
  );
}
