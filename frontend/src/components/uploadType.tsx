"use client";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { PaidUploadType } from "@/types";

type UploadTypeProps = {
  type: PaidUploadType;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};
export default function UploadType({ type, onChange }: UploadTypeProps) {
  const uploadTypes = [
    { label: "Banner", value: "banner" },
    { label: "Brand", value: "brand" },
    { label: "Product Service", value: "product_service" },
    { label: "Sponsored Article", value: "sponsored_article" },
    { label: "Push Notification", value: "push_notification" },
    { label: "Featured Listing", value: "featured_listing" },
    { label: "Event Sponsor", value: "event_sponsor" },
    { label: "Training Sponsor", value: "training_sponsor" },
    { label: "Resource Sponsor", value: "resource_sponsor" },
  ];
  return (
    <div>
      <NativeSelect value={type} onChange={onChange}>
        <NativeSelectOption value="">Select status</NativeSelectOption>
        {uploadTypes.map((uploadType) => (
          <NativeSelectOption key={uploadType.value} value={uploadType.value}>
            {uploadType.label}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </div>
  );
}
