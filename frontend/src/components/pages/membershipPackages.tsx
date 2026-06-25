"use client";
import { useGetMembershipPlans } from "@/hooks/useMembershipPlans";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BannerImage from "../../../public/assets/banner.jpg";
import { Card } from "../ui/card";
import { formatPrice } from "@/utils/formatPrice";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { benefitComparisons } from "@/data/benefitComparison";

export default function MembershipPackages() {
  const router = useRouter();
  const membershipPlans = useGetMembershipPlans();
  const membershipResult = membershipPlans.data?.slice(0, 3) ?? [];
  const isLoading = membershipPlans.isLoading;

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
              member-only features so business owners can easlity decide to
              join.
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
          Membership Plans
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
          {membershipResult.map((data, index) => (
            <div key={data.id} className="relative md:w-1/3 w-full mx-auto">
              {/* Badge */}
              {index === 1 && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10 bg-amber-600 h-8 text-white text-sm px-3 rounded-lg flex items-center">
                  Recommended Plan
                </div>
              )}

              <Card
                className={`h-60 px-6 flex flex-col justify-between transition-all duration-200
            ${index === 1 ? "border border-amber-600 shadow-lg scale-[1.02]" : ""}`}
              >
                <div className="flex flex-col items-start justify-between gap-2">
                  <p className="text-2xl font-bold text-blue-950">
                    {isLoading ? "..." : data.planName}
                  </p>
                  <p className="font-semibold text-2xl text-blue-900">
                    {isLoading ? "..." : formatPrice(data.price) + " / Year"}
                  </p>
                  <p className="text-lg">
                    {isLoading ? "..." : data.durationDays}
                  </p>
                  <p>{isLoading ? "..." : data.benefits}</p>
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

      {/* benefit comparisons */}
      <div className="px-6 md:px-20 py-6">
        <h2 className="text-2xl font-bold text-blue-950 pb-4 px-2 ">
          Benefit Comparisons
        </h2>
        <Table className="border">
          <TableCaption>A list of our membership benefits.</TableCaption>
          <TableHeader className="bg-blue-100">
            <TableRow>
              <TableHead className="font-bold text-blue-950">
                Benefits
              </TableHead>
              <TableHead className="font-bold text-blue-950">
                Basic Member
              </TableHead>
              <TableHead className="font-bold text-blue-950">
                Standard Member
              </TableHead>
              <TableHead className="font-bold text-blue-950">
                Corporate Member
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {benefitComparisons.map((data, i) => (
              <TableRow key={i}>
                <TableCell>{data.benefits}</TableCell>
                <TableCell>{data.basicMember}</TableCell>
                <TableCell>{data.standardMember}</TableCell>
                <TableCell>{data.corporateMember}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
