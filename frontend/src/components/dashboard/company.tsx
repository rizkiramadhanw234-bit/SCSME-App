"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetCompaniesByUserId } from "@/hooks/useCompany";
import { useAuthStore } from "@/stores/auth.store";
import Image from "next/image";
import CompanyModal from "@/components/modals/companyModal";
import DeleteModal from "@/components/modals/companyDelete";
import { MdOutlineCorporateFare } from "react-icons/md";

export default function CompanyPage() {
  const { user } = useAuthStore();
  const companies = useGetCompaniesByUserId(user?.id ?? "");
  const dataCompanies = companies.data ?? [];

  return (
    <div className="py-2 px-2 mt-4">
      <div className="flex gap-2">
        <MdOutlineCorporateFare className="text-3xl text-blue-950 " />
        <h1 className="text-2xl md:text-2xl font-bold text-blue-950 pb-5">
          My Companies
        </h1>
      </div>
      <CompanyModal company={null} />
      <Table className="mt-2">
        <TableCaption>A list of your Companies.</TableCaption>
        <TableHeader className="bg-blue-50">
          <TableRow>
            <TableHead className="w-[150px]">Logo</TableHead>
            <TableHead className="w-[200px]">Company Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[200px]">Website</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        {dataCompanies.length === 0 && (
          <TableBody>
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No companies found.
              </TableCell>
            </TableRow>
          </TableBody>
        )}
        <TableBody>
          {dataCompanies.map((data) => (
            <TableRow key={data.id}>
              <TableCell>
                {data.logoUrl ? (
                  <Image
                    src={data.logoUrl}
                    alt="Logo"
                    width={100}
                    height={100}
                    className="h-15 w-15 rounded-full"
                    unoptimized
                  />
                ) : (
                  <span className="text-gray-400 text-xs">No logo</span>
                )}
              </TableCell>
              <TableCell>{data.companyName ?? "-"}</TableCell>
              <TableCell>{data.category?.name ?? "-"}</TableCell>
              <TableCell>{data.description ?? "-"}</TableCell>
              <TableCell>{data.website ?? "-"}</TableCell>
              <TableCell
                className={
                  data?.verificationStatus === "verified"
                    ? "text-green-600"
                    : data?.verificationStatus === "pending"
                      ? "text-yellow-600"
                      : data?.verificationStatus === "rejected"
                        ? "text-red-600"
                        : ""
                }
              >
                {data.verificationStatus ?? "-"}
              </TableCell>
              <TableCell className="flex gap-2 mt-3">
                <CompanyModal company={data} />
                <DeleteModal data={data} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
