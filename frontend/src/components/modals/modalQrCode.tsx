"use client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { EventRegistration } from "@/types";

type Props = {
  data: EventRegistration | null;
};

export default function ModalQrCode({ data }: Props) {
  return (
    <div>
      <Dialog>
        <DialogTrigger className="cursor-pointer">
          <img src={data?.qrCode} alt="qrCode" className="w-40 h-40" />
        </DialogTrigger>
        <DialogContent className="flex items-center justify-center w-100 h-100">
          <div className="w-90 h-90">
            <p className="font-semibold text-center">QR Code Ticket</p>
            <img src={data?.qrCode} alt="qrCode" className="w-full h-full" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
