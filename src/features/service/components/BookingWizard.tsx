"use client";

import { ChevronLeft } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { OptionTile } from "@/components/ui/OptionTile";
import { StepProgress } from "@/components/ui/StepProgress";
import { bookServiceAction } from "@/features/service/actions";
import { BookingConfirmed } from "@/features/service/components/BookingConfirmed";
import { BookingReview } from "@/features/service/components/BookingReview";
import { DateStep } from "@/features/service/components/DateStep";
import { GarageStep } from "@/features/service/components/GarageStep";
import { ServiceTypeOptions } from "@/features/service/components/ServiceTypeOptions";
import type { GarageOption, ServiceJob, ServiceType } from "@/features/service/types";
import type { MyVehicle } from "@/features/vehicles/types";
import { formatPlate, getVehicleName } from "@/features/vehicles/utils";

type BookingWizardProps = {
  vehicles: MyVehicle[];
  serviceTypes: ServiceType[];
  /** Garages are listed nearest to this PIN. */
  pin: string | null;
  /** Choices made before arriving, e.g. "Book here" on a garage's page. */
  initial: { vehicleId?: string; serviceTypeId?: string; garage?: GarageOption };
};

const titles = ["Vehicle", "Service", "Garage", "Day", "Review"];

/** Whether a garage picked beforehand can be kept: it does this service for this vehicle. */
function garageFits(
  garage: GarageOption | null,
  vehicle: MyVehicle | undefined,
  serviceTypeId: string,
): boolean {
  return Boolean(
    garage &&
    vehicle &&
    garage.vehicleTypes.includes(vehicle.type) &&
    garage.services.some((s) => s.serviceTypeId === serviceTypeId),
  );
}

/** The first step that still needs an answer (1-based). */
function stepAfter(vehicleId: string, serviceTypeId: string, keepsGarage: boolean): number {
  if (!vehicleId) return 1;
  if (!serviceTypeId) return 2;
  return keepsGarage ? 4 : 3;
}

/** Vehicle → service → garage → day → review → sent. Steps chosen beforehand are skipped. */
export function BookingWizard({ vehicles, serviceTypes, pin, initial }: BookingWizardProps) {
  const [vehicleId, setVehicleId] = useState(initial.vehicleId ?? "");
  const [serviceTypeId, setServiceTypeId] = useState(initial.serviceTypeId ?? "");
  const [garage, setGarage] = useState<GarageOption | null>(initial.garage ?? null);
  const [step, setStep] = useState(() =>
    stepAfter(
      vehicleId,
      serviceTypeId,
      garageFits(
        garage,
        vehicles.find((v) => v.id === vehicleId),
        serviceTypeId,
      ),
    ),
  );
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [booked, setBooked] = useState<ServiceJob | null>(null);
  const [isBooking, startTransition] = useTransition();

  const vehicle = vehicles.find((v) => v.id === vehicleId);
  const serviceType = serviceTypes.find((t) => t.id === serviceTypeId);

  function confirm() {
    if (!garage) return;
    startTransition(async () => {
      const result = await bookServiceAction({
        vehicleId,
        serviceTypeId,
        garageId: garage.id,
        date,
        notes,
      });
      if (result.ok) setBooked(result.job);
      else toast.error(result.message);
    });
  }

  if (booked) return <BookingConfirmed job={booked} />;

  return (
    <Card aria-label="Book a service" className="grid gap-6">
      <StepProgress current={step} total={titles.length} title={titles[step - 1]} />

      {step === 1 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {vehicles.map((v) => (
            <OptionTile
              key={v.id}
              isSelected={v.id === vehicleId}
              onClick={() => {
                setVehicleId(v.id);
                setStep(stepAfter(v.id, serviceTypeId, garageFits(garage, v, serviceTypeId)));
              }}
            >
              <span className="font-semibold text-gray-900">{getVehicleName(v)}</span>
              <span className="text-gray-500">
                {formatPlate(v.registrationNumber)} · {v.year}
              </span>
            </OptionTile>
          ))}
        </div>
      )}

      {step === 2 && (
        <ServiceTypeOptions
          types={serviceTypes}
          selectedId={serviceTypeId}
          onSelect={(id) => {
            setServiceTypeId(id);
            setStep(stepAfter(vehicleId, id, garageFits(garage, vehicle, id)));
          }}
        />
      )}

      {step === 3 && vehicle && (
        <GarageStep
          pin={pin}
          serviceTypeId={serviceTypeId}
          vehicleType={vehicle.type}
          selectedId={garage?.id ?? ""}
          onSelect={(chosen) => {
            setGarage(chosen);
            setDate("");
            setStep(4);
          }}
        />
      )}

      {step === 4 && garage && (
        <DateStep
          garageId={garage.id}
          selected={date}
          onSelect={(chosen) => {
            setDate(chosen);
            setStep(5);
          }}
        />
      )}

      {step === 5 && vehicle && serviceType && garage && (
        <BookingReview
          vehicle={vehicle}
          serviceType={serviceType}
          garage={garage}
          date={date}
          notes={notes}
          onNotesChange={setNotes}
        />
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        {step > 1 ? (
          <Button variant="ghost" onClick={() => setStep(step - 1)}>
            <ChevronLeft aria-hidden />
            Back
          </Button>
        ) : (
          <span />
        )}
        {step === 5 && (
          <Button size="lg" disabled={isBooking} onClick={confirm}>
            {isBooking ? "Sending…" : "Send booking"}
          </Button>
        )}
      </div>
    </Card>
  );
}
