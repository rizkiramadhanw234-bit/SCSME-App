"use client";

import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BannerImage from "../../../public/assets/banner.jpg";
import { eventCategories } from "@/data/eventCategories";
import { Card } from "../ui/card";
import { FaCalendarAlt } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { dateStringToLocalTime } from "@/utils/formatDate";
import { BsFillPeopleFill } from "react-icons/bs";
import { useGetEvents } from "@/hooks/useEvent";

export default function EventsTrainingPage() {
  const router = useRouter();
  const events = useGetEvents();
  const eventResult = events.data?.slice(0, 4) ?? [];
  const isLoading = events.isLoading;

  return (
    <div className="mt-20 pb-10">
      <div className="flex flex-col md:flex-row items-center justify-center px-6 md:px-20 py-10 md:py-0 bg-blue-100 md:h-90 h-auto gap-8 md:gap-12">
        {/* Text Section */}
        <div className="flex-1 flex flex-col gap-2 w-full">
          <h1 className="text-2xl md:text-4xl font-bold text-blue-950">
            Events & Training
          </h1>
          <div className="md:w-3/4">
            <p className="pt-2 text-sm md:text-lg">
              Members can view events, register, make payments, check in,
              download certificates and watch replays.
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

      {/* Event Categories */}
      <div className="px-6 md:px-20 py-6">
        <h2 className="text-2xl font-bold text-blue-950 pb-4 px-2">
          Event Categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {eventCategories.map((data, index) => (
            <Card key={index} className="px-6 py-4 flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <span className="md:text-3xl text-2xl text-green-700">
                  {data.icon}
                </span>
                <h3 className="font-bold text-blue-900 text-base md:text-lg">
                  {data.title}
                </h3>
              </div>
              <p className="text-sm text-gray-600">{data.description}</p>
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
                  {isLoading ? "Loading..." : "Register Now"!}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
