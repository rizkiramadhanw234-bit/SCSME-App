"use client";
import { Button } from "../ui/button";
import BannerImage from "../../../public/assets/banner.jpg";
import Image from "next/image";
import { Card } from "../ui/card";
import { ourCoreServices } from "@/data/ourCoreServices";
import { memberValue } from "@/data/memberValue";
import { useGetEvents } from "@/hooks/useEvent";
import { dateStringToLocalTime } from "@/utils/formatDate";
import { FaCalendarAlt } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { BsFillPeopleFill } from "react-icons/bs";
import { FaUsersGear } from "react-icons/fa6";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const events = useGetEvents();
  const eventResult = events.data?.slice(0, 4) ?? [];
  const isLoading = events.isLoading;

  return (
    <div className="mt-20 pb-10">
      {/* hero */}
      <div className="flex flex-col md:flex-row items-center justify-center px-6 md:px-20 py-10 md:py-0 bg-blue-100 md:h-90 h-auto gap-8 md:gap-12">
        {/* Text Section */}
        <div className="flex-1 flex flex-col gap-2 w-full">
          <h1 className="text-2xl md:text-4xl font-bold text-blue-950">
            Connecting Selangor Business, <br className="hidden md:block" />
            Empowering SME Growth
          </h1>
          <div className="md:w-3/4">
            <p className="pt-2 text-sm md:text-lg">
              We are commited to connecting and empowering SMEs in Klang and
              Selangor, providing networking, training, resources and
              collaboration opportunities to help business together.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              className="w-full h-10 sm:w-auto bg-blue-900 hover:bg-blue-950 cursor-pointer"
              onClick={() => router.push("/auth/register")}
            >
              Apply for Membership
            </Button>
            <Button className="w-full h-10 sm:w-auto bg-blue-100 border border-green-700 text-green-700 hover:bg-blue-200">
              View Upcoming Events
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

      {/* our core services */}
      <div className="px-6 md:px-20 py-6">
        <h2 className="text-2xl font-bold text-blue-950 pb-4 px-2">
          Our core services
        </h2>

        {/* cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 items-center justify-center">
          {ourCoreServices.map((data, index) => (
            <Card
              key={index}
              className="md:h-35 h-59 px-6 py-4 flex flex-col justify-start items-start"
            >
              <div className="flex gap-2 items-center">
                <p className=" text-green-700">{data.icon}</p>
                <h3 className="font-bold text-blue-900 md:text-[18px]">
                  {data.title}
                </h3>
              </div>
              <p>{data.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* member value */}
      <div className="px-6 md:px-20">
        <h2 className="text-2xl font-bold text-blue-950 pb-4 px-2">
          Member Value
        </h2>

        {/* cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 items-center justify-center">
          {memberValue.map((data) => (
            <Card
              key={data.id}
              className="md:h-37 h-50 px-6 py-4 flex flex-col justify-start items-start"
            >
              <div className="flex gap-2 items-center">
                <div className="flex items-center justify-center w-10 h-10 bg-green-200 rounded-full">
                  <p className="text-lg font-bold text-green-800">{data.id}</p>
                </div>
                <h3 className="font-bold text-blue-900 md:text-[18px]">
                  {data.title}
                </h3>
              </div>
              <p>{data.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Upcoming events */}
      <div className="px-6 md:px-20 pt-8">
        <div className="px-1 pb-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-blue-950 ">Upcoming events</h2>
          <Button className="bg-white border border-blue-900 text-blue-900 hover:bg-gray-100">
            See All Events
          </Button>
        </div>
        {/* cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 items-center justify-center">
          {eventResult?.map((data) => (
            <Card key={data.id} className="md:h-50 h-50 px-6 py-4">
              <div className="flex flex-col justify-center items-start gap-2">
                <p className="text-base md:text-lg font-bold">
                  {isLoading ? "..." : data.title}
                </p>

                <div className="flex gap-2 items-start">
                  <FaCalendarAlt />
                  <p>
                    {isLoading ? "..." : dateStringToLocalTime(data.eventDate)}
                  </p>
                </div>

                <div className="flex gap-2 items-start">
                  <IoLocationSharp />
                  <p>{isLoading ? "..." : data.location}</p>
                </div>

                <div className="flex gap-2 items-start">
                  <BsFillPeopleFill />
                  <p className="pb-3">
                    About {isLoading ? "..." : data.capacity} people
                  </p>
                </div>

                <Button
                  className="w-full bg-blue-900 hover:bg-blue-950 cursor-pointer"
                  onClick={() => router.push("/auth/register")}
                >
                  {isLoading ? "Loading..." : "Register Now!"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* join scsme */}
      <div className="px-6 md:px-20 pt-8">
        <div className="p-6 bg-blue-200 rounded-md h-full">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:px-20">
            {/* Icon */}
            <div className="w-16 h-16 md:w-24 md:h-24 shrink-0 bg-white rounded-full flex items-center justify-center">
              <FaUsersGear className="text-3xl md:text-5xl text-blue-900" />
            </div>

            {/* Text */}
            <div className="flex flex-col gap-2 text-center md:text-left w-full md:w-1/2">
              <p className="text-xl md:text-2xl font-bold text-blue-950">
                Join SCSME, Make Your Business Strong Together!
              </p>
              <p className="text-sm md:text-base">
                Wether you are a start-up or an established business, join us to
                grow together with entrepreneurs across Selangor and Klang.
                Share resources and unlock more opportunities.
              </p>
            </div>

            {/* Button */}
            <Button className="bg-blue-900 hover:bg-blue-950 w-full md:w-auto shrink-0">
              Join Now!
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
