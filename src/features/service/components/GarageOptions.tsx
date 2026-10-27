import { Star } from "lucide-react";

import { OptionTile } from "@/components/ui/OptionTile";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { GarageOption } from "@/features/service/types";
import { formatDistance } from "@/features/service/utils";

type GarageOptionsProps = {
  garages: GarageOption[];
  selectedId: string;
  onSelect: (garage: GarageOption) => void;
};

/** Garages to pick from, with rating and distance. Prices come from the package, the same everywhere. */
export function GarageOptions({ garages, selectedId, onSelect }: GarageOptionsProps) {
  return (
    <div className="grid gap-3">
      {garages.map((garage) => (
        <OptionTile
          key={garage.id}
          isSelected={garage.id === selectedId}
          onClick={() => onSelect(garage)}
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
        </OptionTile>
      ))}
    </div>
  );
}
