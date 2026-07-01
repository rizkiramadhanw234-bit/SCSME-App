"use client";
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
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import {
  CreatePaidUploadFormData,
  PaidUpload,
  UpdatePaidUploadFormData,
} from "@/types";
import {
  useCreatePaidUpload,
  useUpdatePaidUpload,
} from "@/hooks/usePaidUpload";
import { useAuthStore } from "@/stores/auth.store";
import { useGetCompaniesByUserId } from "@/hooks/useCompany";

import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

type PaidUploadsModalProps = {
  data: PaidUpload | null;
};

const uploadTypes = [
  {
    value: "banner",
    label: "Banner",
  },
  {
    value: "brand",
    label: "Brand",
  },
  {
    value: "product_service",
    label: "Product Service",
  },
  {
    value: "sponsored_article",
    label: "Sponsored Article",
  },
  {
    value: "push_notification",
    label: "Push Notification",
  },
  {
    value: "featured_listing",
    label: "Featured Listing",
  },
  {
    value: "event_sponsor",
    label: "Event Sponsor",
  },
  {
    value: "training_sponsor",
    label: "Training Sponsor",
  },
  {
    value: "resource_sponsor",
    label: "Resource Sponsor",
  },
];

export default function PaidUploadsModal({ data }: PaidUploadsModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthStore();
  const { mutateAsync: newPaidUpload, isPending } = useCreatePaidUpload();
  const { mutateAsync: updatePaidUpload } = useUpdatePaidUpload(
    data?.id as string,
  );
  const { data: companies } = useGetCompaniesByUserId(user?.id as string);

  const [formData, setFormData] = useState<CreatePaidUploadFormData>({
    userId: "",
    companyId: "",
    uploadType: "",
    title: "",
    description: "",
    imageUrl: new File([], ""),
    targetUrl: "",
    placement: "",
    price: 0,
    seoTitle: "",
    metaDescription: "",
    altText: "",
  });

  useEffect(() => {
    if (data && data.id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        userId: data.userId,
        companyId: data.companyId,
        uploadType: data.uploadType,
        title: data.title,
        description: data?.description || "",
        imageUrl: data.imageUrl,
        targetUrl: data.targetUrl || "",
        placement: data.placement || "",
        price: data.price as unknown as number,
        seoTitle: data.seoTitle || "",
        metaDescription: data.metaDescription || "",
        altText: data.altText || "",
      });
    } else {
      if (user) {
        setFormData((prev) => ({ ...prev, userId: user.id }));
      }
    }
  }, [user, data]);

  //   text form
  const handleChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //   file image form
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, imageUrl: file }));
    }
  };

  //   type upload form
  const handleUploadTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, uploadType: e.target.value }));
  };

  //   company dropdown form
  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, companyId: e.target.value }));
  };

  //   price from
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: Number(value) }));
  };

  //   handle submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!formData.companyId) {
        alert("Please select a company");
        return;
      }
      if (!formData.uploadType) {
        alert("Please select a upload type");
        return;
      }
      if (!formData.imageUrl) {
        alert("Please select an image file.");
        return;
      }
      if (data?.id) {
        await updatePaidUpload({
          id: data.id,
          ...formData,
        } as UpdatePaidUploadFormData);
      } else {
        await newPaidUpload(formData);
      }

      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger
          render={<Button>{data?.id ? "Edit" : "Create Paid Upload"}</Button>}
        />
        <DialogContent className="sm:max-w-sm max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{data?.id ? "Edit" : "Create"}</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <Label htmlFor="companyId">Company</Label>
                <NativeSelect
                  name="companyId"
                  id="companyId"
                  onChange={handleCompanyChange}
                >
                  <NativeSelectOption value="">
                    Select Company
                  </NativeSelectOption>
                  {companies?.map((company) => (
                    <NativeSelectOption key={company.id} value={company.id}>
                      {company.companyName}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </Field>
              <Field>
                <Label htmlFor="uploadType">Upload Type</Label>
                <NativeSelect
                  name="uploadType"
                  id="uploadType"
                  value={formData.uploadType}
                  onChange={handleUploadTypeChange}
                >
                  <NativeSelectOption value="">
                    Select Upload Type
                  </NativeSelectOption>
                  {uploadTypes.map((uploadType) => (
                    <NativeSelectOption
                      key={uploadType.value}
                      value={uploadType.value}
                    >
                      {uploadType.label}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </Field>
              <Field>
                <Label htmlFor="title">Title</Label>
                <Input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChangeForm}
                />
              </Field>
              <Field>
                <Label htmlFor="description">Description</Label>
                <Input
                  type="text"
                  name="description"
                  id="description"
                  value={formData.description}
                  onChange={handleChangeForm}
                />
              </Field>
              <Field>
                <Label htmlFor="imageUrl">Image</Label>
                <Input
                  type="file"
                  name="imageUrl"
                  id="imageUrl"
                  onChange={handleFileChange}
                />
              </Field>
              <Field>
                <Label htmlFor="targetUrl">Target URL</Label>
                <Input
                  type="text"
                  name="targetUrl"
                  id="targetUrl"
                  value={formData.targetUrl}
                  onChange={handleChangeForm}
                />
              </Field>
              <Field>
                <Label htmlFor="placement">Placement</Label>
                <Input
                  type="text"
                  name="placement"
                  id="placement"
                  value={formData.placement}
                  onChange={handleChangeForm}
                />
              </Field>
              <Field>
                <Label htmlFor="price">Price</Label>
                <Input
                  type="number"
                  name="price"
                  id="price"
                  value={formData.price}
                  onChange={handlePriceChange}
                />
              </Field>
              <Field>
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  type="text"
                  name="seoTitle"
                  id="seoTitle"
                  value={formData.seoTitle}
                  onChange={handleChangeForm}
                />
              </Field>
              <Field>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Input
                  type="text"
                  name="metaDescription"
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleChangeForm}
                />
              </Field>
              <Field>
                <Label htmlFor="altText">Alt Text</Label>
                <Input
                  type="text"
                  name="altText"
                  id="altText"
                  value={formData.altText}
                  onChange={handleChangeForm}
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose render={<Button variant="outline">Cancel</Button>} />
              <Button type="submit">{isPending ? "Loading..." : "Save"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
