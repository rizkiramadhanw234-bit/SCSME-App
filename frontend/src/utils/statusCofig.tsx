import { PaidUploadStatus } from "@/types";

export const statusConfig: Record<
  PaidUploadStatus,
  { label: string; className: string }
> = {
  draft: {
    label: "Draft",
    className: "bg-gray-100 text-gray-700 border-gray-200",
  },
  pending_payment: {
    label: "Pending Payment",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  pending_review: {
    label: "Pending Review",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  revision_required: {
    label: "Revision Required",
    className: "bg-orange-100 text-orange-800 border-orange-200",
  },
  scheduled: {
    label: "Scheduled",
    className: "bg-purple-100 text-purple-800 border-purple-200",
  },
  published: {
    label: "Published",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  expired: {
    label: "Expired",
    className: "bg-red-100 text-red-700 border-red-200",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-800 border-red-200",
  },
};
