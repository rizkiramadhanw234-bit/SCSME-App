"use client";
import { useCreateCompany, useUpdateCompany } from "@/hooks/useCompany";
import { useGetCategories } from "@/hooks/useCategory";
import type {
  Company,
  CreateCompanyRequest,
  UpdateCompanyRequest,
} from "@/types";
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
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";

interface Props {
  company: Company | null;
}

export default function CompanyModal({ company }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { mutateAsync: createCompany, isPending } = useCreateCompany();
  const { mutateAsync: updateCompany, isPending: isUpdatePending } =
    useUpdateCompany(company?.id as string);

  const { data: categories } = useGetCategories() ?? [];
  const dataCategory = categories?.map((category) => ({
    id: category.id,
    name: category.name,
  }));
  const { user } = useAuthStore();

  const [form, setForm] = useState<CreateCompanyRequest>({
    userId: user?.id as string,
    companyName: "",
    categoryId: "",
    description: "",
    logoUrl: "",
    website: "",
  });

  useEffect(() => {
    if (company && company.id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        userId: company?.userId,
        companyName: company?.companyName,
        categoryId: company?.categoryId,
        description: company?.description,
        logoUrl: company?.logoUrl,
        website: company?.website,
      });
    } else {
      setForm({
        userId: user?.id as string,
        companyName: "",
        categoryId: "",
        description: "",
        logoUrl: "",
        website: "",
      });
    }
  }, [company, user]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({
      ...form,
      categoryId: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({
        ...form,
        logoUrl: file,
      });
    }
  };

  const handleSubmit = async () => {
    try {
      if (company && company.id) {
        await updateCompany(form as UpdateCompanyRequest);
      } else {
        await createCompany(form);
      }
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <form>
          <DialogTrigger
            render={
              <Button variant="outline">
                {company ? "Edit" : "Add Company"}
              </Button>
            }
          />
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>{company ? "Edit" : "Add Company"}</DialogTitle>
              <DialogDescription>
                Make changes to your Company here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  type="text"
                  value={form.companyName}
                  onChange={handleFormChange}
                />
              </Field>
              <Field>
                <Label htmlFor="categoryId">Category</Label>
                <NativeSelect name="categoryId" onChange={handleCategoryChange}>
                  <NativeSelectOption value="">
                    Select Category
                  </NativeSelectOption>
                  {dataCategory?.map((category) => (
                    <NativeSelectOption key={category.id} value={category.id}>
                      {category.name}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </Field>
              <Field>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  type="text"
                  value={form.description as string}
                  onChange={handleFormChange}
                />
              </Field>
              <Field>
                <Label htmlFor="logoUrl">Logo</Label>
                <Input
                  id="logoUrl"
                  name="logoUrl"
                  type="file"
                  onChange={handleFileChange}
                />
              </Field>
              <Field>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  type="text"
                  value={form.website as string}
                  onChange={handleFormChange}
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose render={<Button variant="outline">Cancel</Button>} />
              <Button
                type="submit"
                disabled={isPending || isUpdatePending}
                onClick={handleSubmit}
              >
                {isPending || isUpdatePending
                  ? "Saving..."
                  : company
                    ? "Save"
                    : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
}
