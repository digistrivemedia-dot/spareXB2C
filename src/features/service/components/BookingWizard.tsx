"use client";

import { ChevronLeft } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { OptionTile } from "@/components/ui/OptionTile";
import { StepProgress } from "@/components/ui/StepProgress";
import type { Address } from "@/features/account/types";
import { requestServiceAction } from "@/features/service/actions";
import { BookingConfirmed } from "@/features/service/components/BookingConfirmed";
import { BookingReview } from "@/features/service/components/BookingReview";
import { DateStep } from "@/features/service/components/DateStep";
import { FindingGarage } from "@/features/service/components/FindingGarage";
import { GarageStep, type GarageStepValue } from "@/features/service/components/GarageStep";
import { PackageStep } from "@/features/service/components/PackageStep";
import {
  emptyPickupDropDraft,
  PickupDropStep,
  toPickupDropInput,
} from "@/features/service/components/PickupDropStep";
import type {
  BookServiceInput,
  GarageOption,
  ServiceJob,
  ServicePackage,
  ServiceRequest,
} from "@/features/service/types";
import type { MyVehicle } from "@/features/vehicles/types";
import { formatPlate, getVehicleName } from "@/features/vehicles/utils";

type BookingWizardProps = {
  vehicles: MyVehicle[];
  /** The admin's packages for each of the customer's vehicles, by vehicle id. */
  packagesByVehicle: Record<string, ServicePackage[]>;
  /** Saved addresses, for pick and drop. */
  addresses: Address[];
  /** Garages are listed nearest to this PIN. */
  pin: string | null;
  /** Choices made before arriving, e.g. "Book here" on a garage's page. */
  initial: { vehicleId?: string; packageId?: string; garage?: GarageOption };
};

const titles = ["Vehicle", "Package", "Garage", "Day", "Pick and drop", "Review"];

/** A garage picked beforehand is kept only if it works on this vehicle. */
function keepsGarage(garage: GarageStepValue | null, vehicle: MyVehicle | undefined) {
  if (garage === "best") return true;
  return Boolean(garage && vehicle && garage.vehicleTypes.includes(vehicle.type));
}

/**
 * Vehicle → package → garage → day → pick and drop → review, then the request goes out to garages until one
 * accepts (FindingGarage), then the confirmation. Steps answered beforehand are skipped.
 */
export function BookingWizard({
  vehicles,
  packagesByVehicle,
  addresses,
  pin,
  initial,
}: BookingWizardProps) {
  const [vehicleId, setVehicleId] = useState(initial.vehicleId ?? "");
  // A package id, null for "tell us the problem", undefined until chosen.
  const [packageId, setPackageId] = useState<string | null | undefined>(initial.packageId);
  const [garage, setGarage] = useState<GarageStepValue | null>(initial.garage ?? null);
  const [step, setStep] = useState(() => {
    if (!vehicleId) return 1;
    if (!packageId) return 2;
    return keepsGarage(
      garage,
      vehicles.find((v) => v.id === vehicleId),
    )
      ? 4
      : 3;
  });
  const [date, setDate] = useState("");
  const [pickupDraft, setPickupDraft] = useState(() => emptyPickupDropDraft(addresses));
  const [notes, setNotes] = useState("");
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [booked, setBooked] = useState<ServiceJob | null>(null);
  const [isSending, startTransition] = useTransition();

  const vehicle = vehicles.find((v) => v.id === vehicleId);
  const packages = packagesByVehicle[vehicleId] ?? [];
  const servicePackage = packages.find((p) => p.id === packageId) ?? null;
  const chosenGarage = garage === "best" ? null : garage;
  const pickupDrop = toPickupDropInput(pickupDraft);
  const canSend = pickupDrop !== undefined && (packageId !== null || notes.trim().length > 0);

  // After the package, skip the garage step when one was picked beforehand.
  const afterPackage = () => setStep(keepsGarage(garage, vehicle) ? 4 : 3);

  function send() {
    if (!garage || pickupDrop === undefined || packageId === undefined) return;
    const input: BookServiceInput = {
      vehicleId,
      packageId,
      garage: garage === "best" ? { mode: "best" } : { mode: "chosen", garageId: garage.id },
      date,
      notes,
      pickupDrop,
    };
    startTransition(async () => {
      const result = await requestServiceAction(input);
      if (result.ok) setRequest(result.request);
      else toast.error(result.message);
    });
  }

  if (booked) return <BookingConfirmed job={booked} />;
  if (request) {
    return (
      <FindingGarage
        key={request.id}
        request={request}
        onAccepted={setBooked}
        onBack={() => setRequest(null)}
        onRetry={() => {
          setRequest(null);
          send();
        }}
      />
    );
  }

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
                // Packages are per model, so a different vehicle starts the package again.
                if (v.id !== vehicleId) setPackageId(undefined);
                setVehicleId(v.id);
                setStep(2);
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

      {step === 2 && vehicle && (
        <PackageStep
          vehicleName={getVehicleName(vehicle)}
          packages={packages}
          selected={packageId}
          onSelect={(id) => {
            setPackageId(id);
            if (id !== null) afterPackage();
          }}
          problem={notes}
          onProblemChange={setNotes}
          onContinue={afterPackage}
        />
      )}

      {step === 3 && vehicle && (
        <GarageStep
          pin={pin}
          vehicleType={vehicle.type}
          value={garage}
          onSelect={(chosen) => {
            setGarage(chosen);
            // Open days and pickup times depend on the garage.
            setDate("");
            setPickupDraft({ ...pickupDraft, windowId: "" });
            setStep(4);
          }}
        />
      )}

      {step === 4 && (
        <DateStep
          garageId={chosenGarage?.id ?? null}
          selected={date}
          onSelect={(chosen) => {
            setDate(chosen);
            setStep(5);
          }}
        />
      )}

      {step === 5 && (
        <PickupDropStep
          garage={chosenGarage}
          addresses={addresses}
          draft={pickupDraft}
          onChange={setPickupDraft}
        />
      )}

      {step === 6 && vehicle && pickupDrop !== undefined && (
        <BookingReview
          vehicle={vehicle}
          servicePackage={servicePackage}
          garage={chosenGarage}
          date={date}
          pickupDrop={pickupDrop}
          addresses={addresses}
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
          <Button size="lg" disabled={pickupDrop === undefined} onClick={() => setStep(6)}>
            Continue
          </Button>
        )}
        {step === 6 && (
          <Button size="lg" disabled={isSending || !canSend} onClick={send}>
            {isSending ? "Sending…" : "Book now"}
          </Button>
        )}
      </div>
    </Card>
  );
}
