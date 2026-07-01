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
import { useDeleteEventRegistration } from "@/hooks/useEventRegistration";
import { useState } from "react";

type DeleteProps = {
  id: string;
};
export default function EventsRegistrationDelete({ id }: DeleteProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { mutateAsync: deleteEventRegistration, isPending } =
    useDeleteEventRegistration(id as string);

  const handleDelete = async () => {
    await deleteEventRegistration();

    setIsOpen(false);
  };
  return (
    <div>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger
          render={
            <Button
              variant="outline"
              className="bg-red-700 hover:bg-red-600 text-white hover:text-white"
            />
          }
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
  );
}
