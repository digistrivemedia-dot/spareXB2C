import { Star } from "lucide-react";

import { OptionTile } from "@/components/ui/OptionTile";
import type { GarageOption } from "@/features/service/types";

type GarageOptionsProps = {
  garages: GarageOption[];
  selectedId: string;
  onSelect: (id: string) => void;
};

/** Garages nearest first, with rating and distance. */
export function GarageOptions({ garages, selectedId, onSelect }: GarageOptionsProps) {
  return (
    <div className="grid gap-3">
      {garages.map((garage) => (
        <OptionTile
          key={garage.id}
          isSelected={garage.id === selectedId}
          onClick={() => onSelect(garage.id)}
        >
          <span className="font-semibold text-gray-900">{garage.name}</span>
          <span className="flex items-center gap-1 text-gray-700">
            <Star className="size-4 fill-warning-500 text-warning-500" aria-hidden />
            {garage.rating.toFixed(1)} ({garage.reviewCount}) · {garage.distanceKm} km away
          </span>
          <span className="text-gray-500">
            {garage.address}, {garage.area}
          </span>
        </OptionTile>
      ))}
    </div>
  );
}
