"use client";

import { MapPin } from "lucide-react";

import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { listGaragesAction } from "@/features/service/actions";
import { GarageOptions } from "@/features/service/components/GarageOptions";
import type { GarageOption } from "@/features/service/types";
import type { VehicleType } from "@/features/vehicles/types";
import { useData } from "@/lib/use-data";

type GarageStepProps = {
  pin: string | null;
  serviceTypeId: string;
  vehicleType: VehicleType;
  selectedId: string;
  onSelect: (garage: GarageOption) => void;
};

/** Loads the garages that do this service for this kind of vehicle, nearest first. */
export function GarageStep({
  pin,
  serviceTypeId,
  vehicleType,
  selectedId,
  onSelect,
}: GarageStepProps) {
  const garages = useData(`${pin}|${serviceTypeId}|${vehicleType}`, () =>
    listGaragesAction({ pin: pin ?? undefined, serviceTypeId, vehicleType }),
  );

  if (garages.status === "error") return <ErrorState onRetry={garages.retry} titleAs="h3" />;
  if (garages.status !== "success") {
    return (
      <div className="grid gap-3" aria-busy="true" aria-label="Loading garages">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-28 rounded-xl" />
        ))}
      </div>
    );
  }
  if (garages.data.length === 0) {
    return (
      <EmptyState
        icon={MapPin}
        titleAs="h3"
        title="No garage does this for your vehicle yet"
        description="Try another service, or call us and we'll find a garage for you."
        className="py-8"
      />
    );
  }
  return (
    <GarageOptions
      garages={garages.data}
      serviceTypeId={serviceTypeId}
      selectedId={selectedId}
      onSelect={(id) => {
        const garage = garages.data.find((g) => g.id === id);
        if (garage) onSelect(garage);
      }}
    />
  );
}
