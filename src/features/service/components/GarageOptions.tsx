import { Star } from "lucide-react";

import { OptionTile } from "@/components/ui/OptionTile";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { GarageOption } from "@/features/service/types";
import { formatDistance, getGaragePrice } from "@/features/service/utils";
import { formatPrice } from "@/lib/format";

type GarageOptionsProps = {
  garages: GarageOption[];
  /** The chosen service, to show each garage's own price for it. */
  serviceTypeId: string;
  selectedId: string;
  onSelect: (id: string) => void;
};

/** Garages that do this service for this vehicle, nearest first, with their own prices. */
export function GarageOptions({
  garages,
  serviceTypeId,
  selectedId,
  onSelect,
}: GarageOptionsProps) {
  return (
    <div className="grid gap-3">
      {garages.map((garage) => {
        const price = getGaragePrice(garage, serviceTypeId);
        return (
          <OptionTile
            key={garage.id}
            isSelected={garage.id === selectedId}
            onClick={() => onSelect(garage.id)}
          >
            <span className="flex flex-wrap items-center gap-2 font-semibold text-gray-900">
              {garage.name}
              {garage.isKannaliBranch && <StatusBadge tone="info">Kannali branch</StatusBadge>}
            </span>
            <span className="flex flex-wrap items-center gap-x-1 text-gray-700">
              <Star className="size-4 fill-warning-500 text-warning-500" aria-hidden />
              {garage.rating.toFixed(1)} ({garage.reviewCount})
              {garage.distanceKm !== null && <> · {formatDistance(garage.distanceKm)} away</>}
            </span>
            <span className="text-gray-500">
              {garage.address}, {garage.area}
            </span>
            {price !== null && (
              <span className="font-semibold text-orange-800">from {formatPrice(price)}</span>
            )}
          </OptionTile>
        );
      })}
    </div>
  );
}
