import { Bike, Check } from "lucide-react";
import Image from "next/image";

import type { MyBike } from "@/features/vehicles/types";
import { getBikeName } from "@/features/vehicles/utils";
import { formatRegistration } from "@/lib/format";

type MyBikeListProps = {
  bikes: MyBike[];
  selectedBikeId: string | null;
  onSelect: (bike: MyBike) => void;
};

export function MyBikeList({ bikes, selectedBikeId, onSelect }: MyBikeListProps) {
  return (
    <ul className="grid gap-2">
      {bikes.map((bike) => {
        const isSelected = bike.id === selectedBikeId;
        return (
          <li key={bike.id}>
            <button
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(bike)}
              className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 text-left transition-colors outline-none hover:bg-gray-50 focus-visible:ring-3 focus-visible:ring-ring/50 aria-pressed:border-navy-600 aria-pressed:bg-navy-50"
            >
              <span className="relative flex aspect-4/3 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 text-gray-400">
                {bike.imageUrl ? (
                  <Image src={bike.imageUrl} alt="" fill sizes="64px" className="object-cover" />
                ) : (
                  <Bike className="size-6" aria-hidden />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-gray-900">{getBikeName(bike)}</span>
                <span className="block text-sm text-gray-500">
                  {formatRegistration(bike.registrationNumber)} · {bike.year}
                </span>
              </span>
              {isSelected && <Check className="size-5 text-navy-700" aria-hidden />}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
