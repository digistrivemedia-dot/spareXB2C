"use client";

import { ChevronLeft } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { OptionTile } from "@/components/ui/OptionTile";
import { StepProgress } from "@/components/ui/StepProgress";
import type { Address } from "@/features/account/types";
import { bookServiceAction } from "@/features/service/actions";
import { BookingConfirmed } from "@/features/service/components/BookingConfirmed";
import { BookingReview } from "@/features/service/components/BookingReview";
import { GarageOptions } from "@/features/service/components/GarageOptions";
import { PickupStep } from "@/features/service/components/PickupStep";
import { ServiceTypeOptions } from "@/features/service/components/ServiceTypeOptions";
import { SlotPicker } from "@/features/service/components/SlotPicker";
import type { GarageOption, ServiceDay, ServiceJob, ServiceType } from "@/features/service/types";
import type { MyBike } from "@/features/vehicles/types";
import { getBikeName } from "@/features/vehicles/utils";
import { formatRegistration } from "@/lib/format";

type BookingWizardProps = {
  bikes: MyBike[];
  serviceTypes: ServiceType[];
  garages: GarageOption[];
  slotsByGarage: Record<string, ServiceDay[]>;
  addresses: Address[];
};

const titles = ["Bike", "Service", "Garage", "Date and time", "Pickup and drop", "Review"];

/** Bike → service → garage → date and time → pickup → review → booked. */
export function BookingWizard({
  bikes,
  serviceTypes,
  garages,
  slotsByGarage,
  addresses,
}: BookingWizardProps) {
  const [step, setStep] = useState(0);
  const [bikeId, setBikeId] = useState("");
  const [serviceTypeId, setServiceTypeId] = useState("");
  const [garageId, setGarageId] = useState("");
  const [slot, setSlot] = useState({ date: "", time: "" });
  const [pickupAddressId, setPickupAddressId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [booked, setBooked] = useState<ServiceJob | null>(null);
  const [isBooking, startTransition] = useTransition();

  const bike = bikes.find((b) => b.id === bikeId);
  const serviceType = serviceTypes.find((t) => t.id === serviceTypeId);
  const garage = garages.find((g) => g.id === garageId);

  function confirm() {
    startTransition(async () => {
      const result = await bookServiceAction({
        bikeId,
        serviceTypeId,
        garageId,
        ...slot,
        pickupAddressId,
        notes,
      });
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      setBooked(result.job);
    });
  }

  if (booked) return <BookingConfirmed job={booked} />;

  return (
    <Card aria-label="Book a service" className="grid gap-6">
      <StepProgress current={step + 1} total={titles.length} title={titles[step]} />

      {step === 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {bikes.map((b) => (
            <OptionTile
              key={b.id}
              isSelected={b.id === bikeId}
              onClick={() => {
                setBikeId(b.id);
                setStep(1);
              }}
            >
              <span className="font-semibold text-gray-900">{getBikeName(b)}</span>
              <span className="text-gray-500">
                {formatRegistration(b.registrationNumber)} · {b.year}
              </span>
            </OptionTile>
          ))}
        </div>
      )}

      {step === 1 && (
        <ServiceTypeOptions
          types={serviceTypes}
          selectedId={serviceTypeId}
          onSelect={(id) => {
            setServiceTypeId(id);
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <GarageOptions
          garages={garages}
          selectedId={garageId}
          onSelect={(id) => {
            setGarageId(id);
            setSlot({ date: "", time: "" });
            setStep(3);
          }}
        />
      )}

      {step === 3 && (
        <SlotPicker
          days={slotsByGarage[garageId] ?? []}
          date={slot.date}
          time={slot.time}
          onChange={(date, time) => setSlot({ date, time })}
        />
      )}

      {step === 4 && (
        <PickupStep
          addresses={addresses}
          addressId={pickupAddressId}
          onChange={setPickupAddressId}
        />
      )}

      {step === 5 && bike && serviceType && garage && (
        <BookingReview
          bike={bike}
          serviceType={serviceType}
          garage={garage}
          date={slot.date}
          time={slot.time}
          pickupAddress={addresses.find((a) => a.id === pickupAddressId) ?? null}
          notes={notes}
          onNotesChange={setNotes}
        />
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        {step > 0 ? (
          <Button variant="ghost" onClick={() => setStep(step - 1)}>
            <ChevronLeft aria-hidden />
            Back
          </Button>
        ) : (
          <span />
        )}
        {(step === 3 || step === 4) && (
          <Button size="lg" disabled={step === 3 && !slot.time} onClick={() => setStep(step + 1)}>
            Continue
          </Button>
        )}
        {step === 5 && (
          <Button size="lg" disabled={isBooking} onClick={confirm}>
            {isBooking ? "Booking…" : "Confirm booking"}
          </Button>
        )}
      </div>
    </Card>
  );
}
