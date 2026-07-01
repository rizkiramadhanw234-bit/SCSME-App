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
    <div className="mt-20 pb-10 h-screen">
      <div className="py-6 px-20">
        <div className="flex gap-2 items-center">
          <MdOutlineCorporateFare />
          <h1 className="text-2xl md:text-2xl font-bold text-blue-950 pb-4">
            My Companies
          </h1>
        </div>
        <CompanyModal company={null} />
        <Table className="mt-2">
          <TableCaption>A list of your Companies.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Logo</TableHead>
              <TableHead className="w-[200px]">Company Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
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
                <TableCell>{data.verificationStatus ?? "-"}</TableCell>
                <TableCell className="flex gap-2 mt-3">
                  <CompanyModal company={data} />
                  <DeleteModal data={data} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
