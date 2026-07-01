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
import {
  useGetPaidUploadById,
  useDeletePaidUploads,
} from "@/hooks/usePaidUpload";
import { PaidUpload } from "@/types";

type DeletePaidUploadsProps = {
  data: PaidUpload | null;
};

export default function DeletePaidUploads({ data }: DeletePaidUploadsProps) {
  const { data: paidUploads } = useGetPaidUploadById(data?.id as string);
  const { mutateAsync: deletePaidUploads, isPending } = useDeletePaidUploads(
    paidUploads?.id as string,
  );

  const handleDelete = async () => {
    try {
      await deletePaidUploads();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <AlertDialog>
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
