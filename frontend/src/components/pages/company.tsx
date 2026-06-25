"use client";

import { useState } from "react";
import {
  Building2,
  Globe,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  useGetCompanies,
  useCreateCompany,
  useUpdateCompany,
  useDeleteCompany,
} from "@/hooks/useCompany";
import { useAuthStore } from "@/stores/auth.store";
import type {
  Company,
  CreateCompanyRequest,
  UpdateCompanyRequest,
} from "@/types";

type ModalMode = "create" | "edit" | null;

const statusConfig = {
  verified: {
    label: "Verified",
    icon: CheckCircle,
    className: "text-green-600 bg-green-50",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className: "text-amber-600 bg-amber-50",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "text-red-600 bg-red-50",
  },
};

export default function CompanyPage() {
  const { user } = useAuthStore();
  const { data: companies, isLoading } = useGetCompanies();
  const { mutateAsync: createCompany } = useCreateCompany();

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateCompanyRequest>({
    userId: user?.id ?? "",
    companyName: "",
    categoryId: "",
    description: "",
    website: "",
  });

  const { mutateAsync: updateCompany } = useUpdateCompany(
    selectedCompany?.id ?? "",
  );
  const { mutateAsync: deleteCompany } = useDeleteCompany(
    deleteConfirmId ?? "",
  );

  const openCreate = () => {
    setFormData({
      userId: user?.id ?? "",
      companyName: "",
      categoryId: "",
      description: "",
      website: "",
    });
    setSelectedCompany(null);
    setModalMode("create");
  };

  const openEdit = (company: Company) => {
    setSelectedCompany(company);
    setFormData({
      userId: company.userId,
      companyName: company.companyName,
      categoryId: company.categoryId ?? "",
      description: company.description ?? "",
      website: company.website ?? "",
    });
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedCompany(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalMode === "create") {
        await createCompany(formData);
      } else if (modalMode === "edit") {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { userId: _u, categoryId, ...rest } = formData;
        const updateData: UpdateCompanyRequest = { ...rest, categoryId };
        await updateCompany(updateData);
      }
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    try {
      await deleteCompany();
      setDeleteConfirmId(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mt-20 pb-10 px-6 md:px-20 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-blue-950">
            My Companies
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your registered business profiles
          </p>
        </div>
        <Button
          className="bg-blue-900 hover:bg-blue-950 cursor-pointer flex items-center gap-2"
          onClick={openCreate}
        >
          <Plus size={16} />
          Add Company
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 rounded-lg bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      ) : !companies || companies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
          <Building2 size={48} strokeWidth={1.2} />
          <p className="text-lg font-medium">No companies yet</p>
          <p className="text-sm">
            Click &quot;Add Company&quot; to register your first business
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => {
            const status =
              statusConfig[company.verificationStatus] ?? statusConfig.pending;
            const StatusIcon = status.icon;
            return (
              <Card
                key={company.id}
                className="p-6 flex flex-col gap-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-900 font-bold text-lg">
                      {company.companyName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-blue-950 text-base leading-tight">
                        {company.companyName}
                      </p>
                      {company.website && (
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-blue-600 hover:underline mt-0.5"
                        >
                          <Globe size={11} />
                          {company.website.replace(/^https?:\/\//, "")}
                        </a>
                      )}
                    </div>
                  </div>
                  <span
                    className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full shrink-0 ${status.className}`}
                  >
                    <StatusIcon size={12} />
                    {status.label}
                  </span>
                </div>

                {company.description && (
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {company.description}
                  </p>
                )}

                <div className="flex gap-2 mt-auto pt-2 border-t border-gray-100">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 flex items-center gap-1 cursor-pointer"
                    onClick={() => openEdit(company)}
                  >
                    <Pencil size={13} />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50 cursor-pointer"
                    onClick={() => handleDelete(company.id)}
                  >
                    <Trash2 size={13} />
                    Delete
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-blue-950 mb-5">
              {modalMode === "create" ? "Add Company" : "Edit Company"}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="PT. Example"
                  required
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website ?? ""}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description ?? ""}
                  onChange={handleChange}
                  placeholder="Brief description of your company"
                  rows={3}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 cursor-pointer"
                  onClick={closeModal}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-900 hover:bg-blue-950 cursor-pointer"
                >
                  {modalMode === "create" ? "Create" : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 flex flex-col gap-4">
            <h2 className="text-lg font-bold text-blue-950">Delete Company</h2>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete this company? This action cannot
              be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 cursor-pointer"
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 cursor-pointer"
                onClick={confirmDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
