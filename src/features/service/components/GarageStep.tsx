"use client";

import { Heart, MapPin, Sparkles } from "lucide-react";
import { useState } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { OptionTile } from "@/components/ui/OptionTile";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { listGaragesAction } from "@/features/service/actions";
import { GarageOptions } from "@/features/service/components/GarageOptions";
import type { GarageOption } from "@/features/service/types";
import { useFavouriteGarages } from "@/features/service/useFavouriteGarages";
import type { VehicleType } from "@/features/vehicles/types";
import { useData } from "@/lib/use-data";

/** "best" lets Kannali assign the garage; a garage means the customer picked one. */
export type GarageStepValue = "best" | GarageOption;

type GarageStepProps = {
  pin: string | null;
  vehicleType: VehicleType;
  value: GarageStepValue | null;
  onSelect: (value: GarageStepValue) => void;
};

function GarageListSkeleton() {
  return (
    <div className="grid gap-3" aria-busy="true" aria-label="Loading garages">
      {Array.from({ length: 3 }, (_, index) => (
        <Skeleton key={index} className="h-24 rounded-xl" />
      ))}
    </div>
  );
}

/** Nearby garages that work on this kind of vehicle. */
function NearbyGarages({ pin, vehicleType, value, onSelect }: GarageStepProps) {
  const garages = useData(`${pin}|${vehicleType}`, () =>
    listGaragesAction({ pin: pin ?? undefined, vehicleType }),
  );

  if (garages.status === "error") return <ErrorState onRetry={garages.retry} titleAs="h3" />;
  if (garages.status !== "success") return <GarageListSkeleton />;
  if (garages.data.length === 0) {
    return (
      <EmptyState
        icon={MapPin}
        titleAs="h3"
        title="No garage near you works on this vehicle yet"
        description="Choose “Best garage for me” and we'll find one."
        className="py-6"
      />
    );
  }
  return (
    <GarageOptions
      garages={garages.data}
      selectedId={value !== "best" ? (value?.id ?? "") : ""}
      onSelect={onSelect}
    />
  );
}

/** The customer's favourite garages that work on this kind of vehicle. */
function FavouriteGarageList({ vehicleType, value, onSelect }: Omit<GarageStepProps, "pin">) {
  const { isLoading, isError, retry, garages } = useFavouriteGarages();
  const fitting = garages.filter((g) => g.vehicleTypes.includes(vehicleType));

  if (isError) return <ErrorState onRetry={retry} titleAs="h3" />;
  if (isLoading) return <GarageListSkeleton />;
  if (fitting.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        titleAs="h3"
        title="No favourite garages for this vehicle yet"
        description="Tap the heart on a garage to keep it here. For now, choose from the list or let us pick."
        className="py-6"
      />
    );
  }
  return (
    <GarageOptions
      garages={fitting}
      selectedId={value !== "best" ? (value?.id ?? "") : ""}
      onSelect={onSelect}
    />
  );
}

/**
 * Three ways to pick the garage: let Kannali assign the best one (for customers who don't know a garage),
 * one of their favourites, or one from the nearby list.
 */
export function GarageStep({ pin, vehicleType, value, onSelect }: GarageStepProps) {
  // Coming back to a garage already picked (or passed in from its page), show the list it's in.
  const [browse, setBrowse] = useState<"favourites" | "nearby" | null>(() =>
    value && value !== "best" ? "nearby" : null,
  );

  return (
    <div className="grid gap-4">
      <div className="grid gap-3">
        <OptionTile
          isSelected={value === "best"}
          onClick={() => {
            setBrowse(null);
            onSelect("best");
          }}
          className="gap-1"
        >
          <span className="flex flex-wrap items-center gap-2 font-semibold text-gray-900">
            <Sparkles className="size-4 text-orange-700" aria-hidden />
            Best garage for me
            <StatusBadge tone="success">Recommended</StatusBadge>
          </span>
          <span className="text-gray-600">
            We send it to the best-rated garage that&apos;s free that day. It accepts in seconds.
          </span>
        </OptionTile>
        <div className="grid gap-3 sm:grid-cols-2">
          <OptionTile
            isSelected={browse === "favourites"}
            onClick={() => setBrowse("favourites")}
            className="gap-1"
          >
            <span className="flex items-center gap-2 font-semibold text-gray-900">
              <Heart className="size-4 text-navy-700" aria-hidden />
              My favourite garages
            </span>
            <span className="text-gray-600">Book with a garage you already trust.</span>
          </OptionTile>
          <OptionTile
            isSelected={browse === "nearby"}
            onClick={() => setBrowse("nearby")}
            className="gap-1"
          >
            <span className="flex items-center gap-2 font-semibold text-gray-900">
              <MapPin className="size-4 text-navy-700" aria-hidden />
              Choose a garage
            </span>
            <span className="text-gray-600">See garages near you and pick one.</span>
          </OptionTile>
        </div>
      </div>

      {browse === "favourites" && (
        <FavouriteGarageList vehicleType={vehicleType} value={value} onSelect={onSelect} />
      )}
      {browse === "nearby" && (
        <NearbyGarages pin={pin} vehicleType={vehicleType} value={value} onSelect={onSelect} />
      )}
      {browse !== null && (
        <p className="text-xs text-gray-500">
          If the garage can&apos;t take it in time, we pass it to the next best garage.
        </p>
      )}
    </div>
  );
}
