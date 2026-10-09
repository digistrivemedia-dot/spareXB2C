"use client";

import { MapPin } from "lucide-react";
import { useState } from "react";

import { HeaderAction } from "@/components/layout/HeaderAction";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PinForm } from "@/features/location/components/PinForm";
import { useLocationStore } from "@/features/location/store";
import type { PinLocation } from "@/features/location/types";

type LocationPickerProps = {
  /** Shown until the customer picks a PIN, e.g. their default address. */
  defaultLocation: PinLocation | null;
};

export function LocationPicker({ defaultLocation }: LocationPickerProps) {
  const [open, setOpen] = useState(false);
  const location = useLocationStore((state) => state.location) ?? defaultLocation;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <HeaderAction className="hidden lg:inline-flex">
          <MapPin className="size-5" aria-hidden />
          <span className="flex flex-col items-start leading-tight">
            <span className="text-xs font-normal text-navy-100">Deliver to</span>
            <span className="max-w-40 truncate font-semibold">
              {location ? `${location.area} ${location.pin}` : "Select location"}
            </span>
          </span>
        </HeaderAction>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose your delivery location</DialogTitle>
          <DialogDescription>
            Enter your PIN code to see delivery dates and services near you.
          </DialogDescription>
        </DialogHeader>
        <PinForm onSaved={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
