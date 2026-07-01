"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/auth.store";
import { useCreateEventRegistration } from "@/hooks/useEventRegistration";
import { useGetEventById } from "@/hooks/useEvent";
import { CreateEventRegistrationRequest } from "@/types";
import { useState, useEffect } from "react";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

const ticketTypes = [
  {
    value: "standard",
    label: "Standard",
  },
  {
    value: "vip",
    label: "VIP",
  },
];

const status = [
  {
    value: "registered",
    label: "Registered",
  },
  {
    value: "attended",
    label: "Attended",
  },
  {
    value: "absent",
    label: "Absent",
  },
];

type Props = {
  eventId: string;
};

export default function EventsRegistrationModal({ eventId }: Props) {
  const { user } = useAuthStore();
  const { mutateAsync: newEventRegistration, isPending } =
    useCreateEventRegistration();
  const { data: event } = useGetEventById(eventId) ?? null;
  const [formData, setFormData] = useState<CreateEventRegistrationRequest>({
    eventId: "",
    userId: "",
    ticketType: "",
    attendanceStatus: "",
  });

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData((prev) => ({
        ...prev,
        userId: user?.id,
        eventId: eventId,
      }));
    }
  }, [user, eventId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!formData.userId || !formData.eventId) return;
      if (!formData.ticketType) {
        alert("Please select a ticket type");
        return;
      }
      if (!formData.attendanceStatus) {
        alert("Please select an attendance status");
        return;
      }
      await newEventRegistration(formData as CreateEventRegistrationRequest);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger
          render={
            <Button
              variant="outline"
              className="bg-blue-900 hover:bg-blue-950 text-white hover:text-white cursor-pointer"
            >
              Join Event
            </Button>
          }
        />
        <DialogContent className="sm:max-w-sm">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{event?.title}</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <Label htmlFor="ticketType">Ticket Type</Label>
                <NativeSelect
                  value={formData.ticketType}
                  onChange={(e) =>
                    setFormData({ ...formData, ticketType: e.target.value })
                  }
                >
                  <NativeSelectOption value="">
                    Select ticket
                  </NativeSelectOption>
                  {ticketTypes.map((ticketType) => (
                    <NativeSelectOption
                      key={ticketType.value}
                      value={ticketType.value}
                    >
                      {ticketType.label}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </Field>
              <Field className="pb-4">
                <Label htmlFor="attendanceStatus">Attendance Status</Label>
                <NativeSelect
                  value={formData.attendanceStatus}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      attendanceStatus: e.target.value,
                    })
                  }
                >
                  <NativeSelectOption value="">
                    Select status
                  </NativeSelectOption>
                  {status.map((status) => (
                    <NativeSelectOption key={status.value} value={status.value}>
                      {status.label}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose render={<Button variant="outline">Cancel</Button>} />
              <Button type="submit">{isPending ? "Joining..." : "Join"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
