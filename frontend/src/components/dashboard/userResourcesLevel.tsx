"use client";

import { FaCalendarCheck } from "react-icons/fa";
import { Card } from "../ui/card";
import {
  useGetLevelUserResources,
  useGetPaidResources,
} from "@/hooks/useUserResources";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "../ui/button";
import { formatPrice } from "@/utils/formatPrice";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { useState } from "react";
import { SpinnerCustom } from "../ui/spinner";
import ResourcePurchasesModal from "../modals/resourcePurchasesModal";

const typeFilter = {
  article: "Article",
  template: "Template",
  replay: "Replay",
  course: "Course",
};

export default function ResourcesUserLevel() {
  const [selectedType, setSelectedType] = useState<string>("");
  const { user } = useAuthStore();
  const { data: resourcesLevel, isLoading } =
    useGetLevelUserResources(user?.id ?? "") ?? [];

  // filtered type resources
  const filteredResources = selectedType
    ? resourcesLevel?.filter((item) => item.type === selectedType)
    : resourcesLevel;

  // data paid resources
  const { data: paidResources, isLoading: isLoadingPaid } =
    useGetPaidResources() ?? [];

  return (
    <>
      <div className="py-2 px-2 pt-4 pb-4">
        <div className="flex gap-2">
          <FaCalendarCheck className="text-2xl text-blue-950 mt-0.5" />
          <h1 className="text-2xl md:text-2xl font-bold text-blue-950 pb-5">
            Resources
          </h1>
        </div>

        {/* filter */}
        <div className="pb-2 ">
          <NativeSelect
            value={selectedType}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setSelectedType(e.target.value)
            }
          >
            <NativeSelectOption value="">All Type</NativeSelectOption>
            {Object.entries(typeFilter).map(([key, value]) => (
              <NativeSelectOption key={key} value={key}>
                {value}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>

        {/* resources level */}
        {isLoading ? (
          <div className="flex items-center justify-center">
            <SpinnerCustom />
          </div>
        ) : (
          <>
            {filteredResources?.length === 0 && (
              <div className="pt-2">
                <Card className="p-4 h-38 flex items-center justify-center">
                  <p className="text-sm text-gray-500">No resources yet</p>
                </Card>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {filteredResources?.map((item) => (
                <Card className="p-4 h-full w-full" key={item.id}>
                  <div>
                    {/* badge */}
                    <div className="flex items-center justify-between pb-2">
                      <span className="px-2 py-1 rounded-full text-xs text-blue-950 bg-green-100">
                        {item.accessLevel}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs text-blue-950 bg-blue-100">
                        {item.type}
                      </span>
                    </div>

                    {/* image cover */}
                    <img
                      src={item.coverImage ?? ""}
                      alt={item.title}
                      className="w-full h-40 rounded-xl"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    <p>{formatPrice(item.price)}</p>
                    <p>{item.seoTitle}</p>
                    <p>{item.metaDescription}</p>
                  </div>

                  {/* button download */}
                  <a
                    href={item.fileUrl ?? ""}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="flex w-full bg-blue-900 hover:bg-blue-950 cursor-pointer">
                      Download File
                    </Button>
                  </a>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* paid resources */}
        <div className="pt-8 items-center justify-center w-full">
          <p className="font-semibold pb-2">Paid Resources</p>
          {/* resources level */}
          {isLoadingPaid ? (
            <div className="flex items-center justify-center">
              <SpinnerCustom />
            </div>
          ) : (
            <>
              {paidResources?.length === 0 && (
                <div className="pt-2">
                  <Card className="p-4 h-38 flex items-center justify-center">
                    <p className="text-sm text-gray-500">No resources yet</p>
                  </Card>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {paidResources?.map((item) => (
                  <Card className="p-4 h-full w-full" key={item.id}>
                    <div>
                      {/* badge */}
                      <div className="flex items-center justify-between pb-2">
                        <span className="px-2 py-1 rounded-full text-xs text-blue-950 bg-green-100">
                          {item.accessLevel}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs text-blue-950 bg-blue-100">
                          {item.type}
                        </span>
                      </div>

                      {/* image cover */}
                      <img
                        src={item.coverImage ?? ""}
                        alt={item.title}
                        className="w-full h-40 rounded-xl"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="font-bold text-lg">{item.title}</h3>
                      <p>{formatPrice(item.price)}</p>
                      <p>{item.seoTitle}</p>
                      <p>{item.metaDescription}</p>
                    </div>

                    {/* buy */}
                    <ResourcePurchasesModal resourceId={item.id} />
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
