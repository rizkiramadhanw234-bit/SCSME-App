"use client";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BannerImage from "../../../public/assets/banner.jpg";
import { Card } from "../ui/card";
import { paidUploadItems } from "@/data/paidUploadItems";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import UploadType from "../uploadType";
import { useState, useEffect } from "react";
import type { CreatePaidUploadFormData, PaidUploadType } from "@/types";
import { useAuthStore } from "@/stores/auth.store";
import { useGetCompanies } from "@/hooks/useCompany";
import { useCreatePaidUpload } from "@/hooks/usePaidUpload";

export default function SponsorshipExposure() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: companies } = useGetCompanies();
  const { mutateAsync: createPaidUpload, isPending } = useCreatePaidUpload();

  const [formData, setFormData] = useState<
    Omit<CreatePaidUploadFormData, "id" | "createdAt" | "updatedAt">
  >({
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
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData((prev) => ({ ...prev, userId: user.id }));
    }
  }, [user]);

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, companyId: e.target.value }));
  };

  const handleChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, imageUrl: file }));
    }
  };

  const handleUploadTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, uploadType: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.imageUrl || formData.imageUrl.size === 0) {
      alert("Please select an image file.");
      return;
    }
    try {
      createPaidUpload(formData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mt-20 pb-10">
      <div className="flex flex-col md:flex-row items-center justify-center px-6 md:px-20 py-10 md:py-0 bg-blue-100 md:h-90 h-auto gap-8 md:gap-12">
        {/* Text Section */}
        <div className="flex-1 flex flex-col gap-2 w-full">
          <h1 className="text-2xl md:text-4xl font-bold text-blue-950">
            Membership Services & Packages
          </h1>
          <div className="md:w-3/4">
            <p className="pt-2 text-sm md:text-lg">
              Clearly present membership benefits, fees, joining steps and
              member-only features so business owners can easily decide to join.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              className="w-full h-10 sm:w-auto bg-blue-900 hover:bg-blue-950 cursor-pointer"
              onClick={() => router.push("/auth/register")}
            >
              Apply for membership
            </Button>
            <Button className="w-full h-10 sm:w-auto bg-blue-100 border border-green-700 text-green-700 hover:bg-blue-200">
              Learn More
            </Button>
          </div>
        </div>
        {/* Image Section */}
        <div className="flex justify-center w-full md:w-auto">
          <div className="p-4 bg-white shadow-lg rounded-md w-full md:w-auto">
            <Image
              src={BannerImage}
              alt="banner"
              width={500}
              className="w-full md:w-125 h-auto rounded"
            />
          </div>
        </div>
      </div>

      {/* Paid Upload items */}
      <div className="px-6 md:px-20 py-6">
        <h2 className="text-2xl font-bold text-blue-950 pb-8 px-2">
          Paid Upload items
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
          {paidUploadItems.map((data, index) => (
            <div key={data.id} className="relative md:w-1/3 w-full mx-auto">
              {index === 0 && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10 bg-amber-600 h-8 text-white text-sm px-3 rounded-lg flex items-center">
                  Recommended Plan
                </div>
              )}
              <Card
                className={`h-60 px-6 flex flex-col justify-between transition-all duration-200
            ${index === 0 ? "border border-amber-600 shadow-lg scale-[1.02]" : ""}`}
              >
                <div className="flex flex-col items-start justify-between gap-2">
                  <p className="text-2xl font-bold text-blue-950">
                    {data.title}
                  </p>
                  <p className="font-semibold text-2xl text-blue-900">
                    {data.price}
                  </p>
                  <p className="text-lg">{data.description}</p>
                </div>
                <Button
                  className="w-full h-9 bg-blue-900 hover:bg-blue-950 cursor-pointer"
                  onClick={() => router.push(`/membership-packages/${data.id}`)}
                >
                  Select Plan
                </Button>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Advertising Upload Form */}
      <div className="px-6 md:px-20 py-6">
        <h2 className="text-2xl font-bold text-blue-950 pb-4 px-2">
          Advertising Upload Form
        </h2>
        <div className="border border-gray-300 p-4 rounded-lg">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-6">
              {/* left column */}
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="companyId">Company</Label>
                  <select
                    id="companyId"
                    name="companyId"
                    value={formData.companyId}
                    onChange={handleCompanyChange}
                    required
                    className="border border-gray-300 rounded-md px-3 h-9 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Company</option>
                    {companies?.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.companyName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="uploadType">Upload Type</Label>
                  <UploadType
                    type={formData.uploadType as PaidUploadType}
                    onChange={handleUploadTypeChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    placeholder="Title"
                    onChange={handleChangeForm}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    value={formData.description ?? ""}
                    placeholder="Description"
                    onChange={handleChangeForm}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="imageUrl">Image</Label>
                  <Input
                    id="imageUrl"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="targetUrl">Target URL</Label>
                  <Input
                    id="targetUrl"
                    name="targetUrl"
                    type="url"
                    value={formData.targetUrl ?? ""}
                    placeholder="https://example.com"
                    onChange={handleChangeForm}
                    required
                  />
                </div>
              </div>

              {/* right column */}
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="placement">Placement</Label>
                  <Input
                    id="placement"
                    name="placement"
                    value={formData.placement ?? ""}
                    placeholder="Placement"
                    onChange={handleChangeForm}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    placeholder="0"
                    onChange={handleChangeForm}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="seoTitle">SEO Title</Label>
                  <Input
                    id="seoTitle"
                    name="seoTitle"
                    value={formData.seoTitle ?? ""}
                    placeholder="SEO Title"
                    onChange={handleChangeForm}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Input
                    id="metaDescription"
                    name="metaDescription"
                    value={formData.metaDescription ?? ""}
                    placeholder="Meta Description"
                    onChange={handleChangeForm}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="altText">Alt Text</Label>
                  <Input
                    id="altText"
                    name="altText"
                    value={formData.altText ?? ""}
                    placeholder="Alt Text"
                    onChange={handleChangeForm}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                className="w-full h-9 bg-blue-900 hover:bg-blue-950 cursor-pointer"
                type="submit"
              >
                {isPending ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
