"use client";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BannerImage from "../../../public/assets/banner.jpg";
import { Card } from "../ui/card";
import { resourceCategories } from "@/data/resourceCategories";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { resourceAccess } from "@/data/resourceAccess";

export default function ResourceCentre() {
  const router = useRouter();

  return (
    <div className="mt-20 pb-10">
      <div className="flex flex-col md:flex-row items-center justify-center px-6 md:px-20 py-10 md:py-0 bg-blue-100 md:h-90 h-auto gap-8 md:gap-12">
        {/* Text Section */}
        <div className="flex-1 flex flex-col gap-2 w-full">
          <h1 className="text-2xl md:text-4xl font-bold text-blue-950">
            Resource Centre
          </h1>
          <div className="md:w-3/4">
            <p className="pt-2 text-sm md:text-lg">
              A central hub for policy updates, practical templates, course
              replays, industry information and member-only downloads.
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

      {/* membership plans */}
      <div className="px-6 md:px-20 py-6">
        <h2 className="text-2xl font-bold text-blue-950 pb-4 px-2">
          Member Centre Modules
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {resourceCategories.map((data, index) => (
            <Card key={index} className="px-6 py-4 flex flex-col gap-2">
              <div className="flex gap-4 items-center">
                <span>{data.icon}</span>
                <h3 className="md:text-xl text-lg text-blue-950 font-semibold">
                  {data.title}
                </h3>
              </div>
              <p>{data.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* resource access & charges */}
      <div className="px-6 md:px-20 py-6">
        <h2 className="text-2xl font-bold text-blue-950 pb-4 px-2">
          Resource Access & Charges
        </h2>
        <Table className="border">
          <TableCaption>A list of Resource Access & Charges.</TableCaption>
          <TableHeader className="bg-blue-100">
            <TableRow>
              <TableHead className="font-bold text-blue-950">
                Resource Type
              </TableHead>
              <TableHead className="font-bold text-blue-950">
                Free Member
              </TableHead>
              <TableHead className="font-bold text-blue-950">
                Standard Member
              </TableHead>
              <TableHead className="font-bold text-blue-950">
                Charge Method
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resourceAccess.map((data, i) => (
              <TableRow key={i}>
                <TableCell>{data.resourceType}</TableCell>
                <TableCell>{data.freeMember}</TableCell>
                <TableCell>{data.standardMember}</TableCell>
                <TableCell>{data.chargedMethod}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
