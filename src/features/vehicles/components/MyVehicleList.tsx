import { Check } from "lucide-react";

import { VehiclePhoto } from "@/features/vehicles/components/VehiclePhoto";
import type { MyVehicle } from "@/features/vehicles/types";
import { formatPlate, getVehicleName } from "@/features/vehicles/utils";

type MyVehicleListProps = {
  vehicles: MyVehicle[];
  selectedVehicleId: string | null;
  onSelect: (vehicle: MyVehicle) => void;
};

export function MyVehicleList({ vehicles, selectedVehicleId, onSelect }: MyVehicleListProps) {
  return (
    <ul className="grid gap-2">
      {vehicles.map((vehicle) => {
        const isSelected = vehicle.id === selectedVehicleId;
        return (
          <li key={vehicle.id}>
            <button
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(vehicle)}
              className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 text-left transition-colors outline-none hover:bg-gray-50 focus-visible:ring-3 focus-visible:ring-ring/50 aria-pressed:border-navy-600 aria-pressed:bg-navy-50"
            >
              <VehiclePhoto vehicle={vehicle} sizes="64px" className="w-16" />
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-gray-900">{getVehicleName(vehicle)}</span>
                <span className="block text-sm text-gray-500">
                  {formatPlate(vehicle.registrationNumber)} · {vehicle.year}
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
