"use client";

import { FaCalendarCheck } from "react-icons/fa6";
import { useGetEventRegistrationByUserId } from "@/hooks/useEventRegistration";
import { useAuthStore } from "@/stores/auth.store";
import { useGetEvents } from "@/hooks/useEvent";
import { Card } from "../ui/card";
import { dateStringToLocalTime } from "@/utils/formatDate";
import { BsFillPeopleFill } from "react-icons/bs";
import { FaCalendarAlt } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { SpinnerCustom } from "../ui/spinner";
import { MdPayments } from "react-icons/md";
import { IoTicket } from "react-icons/io5";
import { PiCertificate } from "react-icons/pi";
import ModalQrCode from "../modals/modalQrCode";
import EventsRegistrationDelete from "../modals/eventsRegistrationDelete";
import EventsRegistrationModal from "../modals/eventsRegistrationModal";
import { formatPrice } from "@/utils/formatPrice";

export default function EventRegistration() {
  const { user } = useAuthStore();
  const { data: userRegistration } =
    useGetEventRegistrationByUserId(user?.id ?? "") ?? null;

  const { data: events, isLoading: isLoadingEvents } = useGetEvents();
  const eventsResult = events ?? [];

  const otherEvents = eventsResult.filter(
    (event) => !userRegistration?.find((e) => e.eventId === event.id),
  );

  return (
    <div className="py-2 px-2 mt-4">
      <div className="flex gap-2">
        <FaCalendarCheck className="text-2xl text-blue-950 mt-0.5" />
        <h1 className="text-2xl md:text-2xl font-bold text-blue-950 pb-5">
          Event Registration
        </h1>
      </div>

      {/* Current event registered */}
      <div>
        <h2 className="font-bold">Events Joined</h2>
        {userRegistration?.length === 0 ? (
          <div className="pt-2">
            <Card className="p-4 h-38 flex items-center justify-center">
              <p className="text-sm text-gray-500">No events joined</p>
            </Card>
          </div>
        ) : (
          <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {userRegistration?.map((item) => (
              <Card key={item.id} className="p-4 h-full">
                <div className="flex-row md:flex items-center justify-between">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-base md:text-lg font-bold">
                      {item?.event?.title}
                    </h3>
                    <span>{formatPrice(item.event?.price)}</span>
                    <div className="flex gap-2 items-center">
                      <IoTicket />
                      <p>Ticket Type: {item.ticketType}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <MdPayments />
                      <p>Payment Status: {item.paymentStatus}</p>
                    </div>

                    <div className="flex gap-2 items-center">
                      <FaCalendarAlt />
                      <p>Attendance Status: {item.attendanceStatus}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <PiCertificate />{" "}
                      <p>Certificate: {item.certificateUrl}</p>
                    </div>
                  </div>
                  <div>
                    <ModalQrCode
                      data={typeof item === "object" ? item : null}
                    />
                  </div>
                </div>
                <EventsRegistrationDelete data={item} />
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* other events */}
      <div className="pt-8 items-center justify-center w-full">
        <p className="font-semibold pb-2">Other Events</p>
        {isLoadingEvents ? (
          <Card className="p-4 h-50 flex items-center justify-center">
            <SpinnerCustom />
          </Card>
        ) : (
          <>
            {otherEvents.length === 0 && (
              <Card className="p-4 h-38 flex items-center justify-center">
                <p className="text-sm text-gray-500">No other events</p>
              </Card>
            )}
            <div className="grid md:grid-cols-3 gap-4">
              {otherEvents.map((data) => (
                <Card key={data.id} className="md:h-full h-full px-6 py-4">
                  <div className="flex flex-col justify-center items-start gap-2">
                    <div>
                      <img
                        src={data.coverImage ?? ""}
                        alt="event"
                        width={100}
                        height={100}
                        className="w-full h-40 object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-base md:text-lg font-bold">
                        {data.title}
                      </h2>
                      <span>{formatPrice(data.price)}</span>
                    </div>

                    <div className="flex gap-2 items-start">
                      <FaCalendarAlt />
                      <p>{dateStringToLocalTime(data.eventDate)}</p>
                    </div>

                    <div className="flex gap-2 items-start">
                      <IoLocationSharp />
                      <p>{data.location}</p>
                    </div>

                    <div className="flex gap-2 items-start">
                      <BsFillPeopleFill />
                      <p className="pb-3">About {data.capacity} people</p>
                    </div>

                    <EventsRegistrationModal eventId={data.id} />
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
