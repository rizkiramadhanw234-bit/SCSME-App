"use client";

import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BannerImage from "../../../public/assets/banner.jpg";
import { ourRole } from "@/data/ourRole";
import { Card } from "../ui/card";
import { ourDirection } from "@/data/ourDirection";

export default function AboutUs() {
  const router = useRouter();
  return (
    <div className="mt-20 pb-10">
      {/* hero */}
      <div className="flex flex-col md:flex-row items-center justify-center px-6 md:px-20 py-10 md:py-0 bg-blue-100 md:h-90 h-auto gap-8 md:gap-12">
        {/* Text Section */}
        <div className="flex-1 flex flex-col gap-2 w-full">
          <h1 className="text-2xl md:text-4xl font-bold text-blue-950">
            About SCSME
          </h1>
          <div className="md:w-3/4">
            <p className="pt-2 text-sm md:text-lg">
              Centered on SMEs in Klang and Selangor, we are building a
              friendly, practical and trusted networking platform for
              entrepreneurs.
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

      {/* Our Role */}
      <div className="px-6 md:px-20 py-6">
        <h2 className="text-2xl font-bold text-blue-950 pb-4 px-2">Our Role</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {ourRole.map((role, index) => (
            <Card key={index} className="px-6 py-4 flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <span className="text-green-700">{role.icon}</span>
                <h3 className="font-bold text-blue-900 text-base md:text-lg">
                  {role.title}
                </h3>
              </div>
              <p className="text-sm text-gray-600">{role.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Our Direction */}
      <div className="px-6 md:px-20 py-6">
        <h2 className="text-2xl font-bold text-blue-950 pb-4 px-2">
          Our Direction
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {ourDirection.map((data) => (
            <Card key={data.id} className="px-6 py-4 flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <span className="text-blue-900 font-bold">{data.id}</span>
                <h3 className="font-bold text-blue-900 text-base md:text-lg">
                  {data.title}
                </h3>
              </div>
              <p className="text-sm text-gray-600">{data.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
