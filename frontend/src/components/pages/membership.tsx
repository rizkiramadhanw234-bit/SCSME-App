"use client";

import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BannerImage from "../../../public/assets/banner.jpg";
import { memberCentreModules } from "@/data/memberCentreModules";
import { Card } from "../ui/card";

export default function Membership() {
  const router = useRouter();

  return (
    <div className="mt-20 pb-10">
      <div className="flex flex-col md:flex-row items-center justify-center px-6 md:px-20 py-10 md:py-0 bg-blue-100 md:h-90 h-auto gap-8 md:gap-12">
        {/* Text Section */}
        <div className="flex-1 flex flex-col gap-2 w-full">
          <h1 className="text-2xl md:text-4xl font-bold text-blue-950">
            Membership App / Membership Centre
          </h1>
          <div className="md:w-3/4">
            <p className="pt-2 text-sm md:text-lg">
              After loggin in, members can manage business profiles, register
              for events, purchase promotional uploads, download resources and
              view payment records.
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

      {/* Member Centre Modules */}
      <div className="px-6 md:px-20 py-6">
        <h2 className="text-2xl font-bold text-blue-950 pb-4 px-2">
          Member Centre Modules
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {memberCentreModules.map((data, index) => (
            <Card key={index} className="px-6 py-4 flex flex-col gap-2">
              <h3 className="md:text-xl text-lg text-blue-950 font-semibold">
                {data.title}
              </h3>
              <p className="text-xl font-bold text-blue-900 md:text-2xl">
                {data.data}
              </p>
              <p>{data.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
