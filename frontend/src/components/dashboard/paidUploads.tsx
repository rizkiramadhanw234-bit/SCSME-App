"use client";

import { FaCalendarCheck } from "react-icons/fa6";
import { Card } from "../ui/card";
import { useAuthStore } from "@/stores/auth.store";
import { useGetPaidUploadByUserId } from "@/hooks/usePaidUpload";
import { statusConfig } from "@/utils/statusCofig";
import { formatPrice } from "@/utils/formatPrice";
import { dateStringToLocalTime } from "@/utils/formatDate";
import PaidUploadsModal from "../modals/paidUploadsModal";
import DeletePaidUploads from "../modals/paidUploadsDelete";

export default function PaidUploads() {
  const { user } = useAuthStore();
  const { data: paidUploadsUserId } = useGetPaidUploadByUserId(user?.id ?? "");

  return (
    <>
      <div className="py-2 px-2 mt-4">
        <div className="flex gap-2">
          <FaCalendarCheck className="text-2xl text-blue-950 mt-0.5" />
          <h1 className="text-2xl md:text-2xl font-bold text-blue-950 pb-5">
            Paid Uploads
          </h1>
        </div>

        {/* paid uploads */}
        <div>
          <div className="flex items-center justify-between">
            <h2>Active promotions</h2>
            <PaidUploadsModal data={null} />
          </div>
          <div className="pt-2">
            <>
              {paidUploadsUserId?.length === 0 && (
                <div className="pt-2">
                  <Card className="p-4 h-38 flex items-center justify-center">
                    <p className="text-sm text-gray-500">No paid uploads yet</p>
                  </Card>
                </div>
              )}
            </>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full">
              {paidUploadsUserId?.map((item) => (
                <Card key={item.id} className="p-4 h-full w-full">
                  {/* badge */}
                  <div className="relative">
                    <span className="absolute top-2 left-2 px-3 py-1 bg-blue-100 text-blue-950 rounded-xl">
                      {item.uploadType}
                    </span>
                    <span
                      className={`absolute top-2 right-2 text px-2 py-1 rounded-full border ${statusConfig[item.status].className}`}
                    >
                      {item.status}
                    </span>
                    {/* image cover */}
                    <div>
                      <img
                        className="w-full h-48 object-cover rounded-2xl"
                        src={item.imageUrl ?? ""}
                        alt={item.altText ?? ""}
                      />
                    </div>
                  </div>

                  {/* data */}
                  <div className="px-2">
                    <div className="flex flex-col gap-1">
                      <div>{item?.company?.companyName}</div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg">{item.title}</h3>
                        <span>{formatPrice(item.price)}</span>
                      </div>
                      <p className="text-sm">{item.description}</p>
                      <span className="border-b-2 pt-1" />
                    </div>

                    {/* body */}
                    <div className="pt-3 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span>Start Date</span>{" "}
                        <p>
                          {item.startDate &&
                            dateStringToLocalTime(item.startDate)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>End Date</span>
                        <p>
                          {item.endDate && dateStringToLocalTime(item.endDate)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Placement</span>
                        <p>{item.placement}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Target Url</span>
                        <p>{item.targetUrl}</p>
                      </div>
                      <span className="border-b-2 pt-1" />
                    </div>

                    {/* seo */}
                    <div className="pt-3 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span>Title</span>
                        <p>{item.seoTitle}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Meta</span>
                        <p>{item.metaDescription}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Alt text</span>
                        <p>{item.altText}</p>
                      </div>
                    </div>
                  </div>
                  {/* admin notes */}
                  <div className="px-2 py-3 bg-green-100 rounded-lg">
                    <span>Admin Notes: {item.adminNotes}</span>
                  </div>
                  <div className="flex items-center justify-start gap-2">
                    <PaidUploadsModal data={item} />
                    <DeletePaidUploads id={item.id} />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
