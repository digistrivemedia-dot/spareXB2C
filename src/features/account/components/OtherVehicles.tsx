import { Plus } from "lucide-react";
import Link from "next/link";

import { VehiclePhoto } from "@/features/vehicles/components/VehiclePhoto";
import type { MyVehicle } from "@/features/vehicles/types";
import { formatPlate } from "@/features/vehicles/utils";
import { cn } from "@/lib/utils";

/** How many other vehicles get a chip before "See all". */
const SHOWN = 2;

const chipClass =
  "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-gray-200 py-1 pr-2.5 pl-1 text-sm outline-none hover:border-navy-200 hover:bg-navy-50 focus-visible:ring-3 focus-visible:ring-ring/50";

type OtherVehiclesProps = {
  /** All the customer's vehicles; the one on screen is left out. */
  vehicles: MyVehicle[];
  currentVehicleId: string;
};

/** The customer's other vehicles as slim chips, one tap to switch the home page (the header follows), and "+". */
export function OtherVehicles({ vehicles, currentVehicleId }: OtherVehiclesProps) {
  const others = vehicles.filter((v) => v.id !== currentVehicleId);

  return (
    <nav aria-labelledby="other-vehicles-heading" className="grid min-w-0 content-start gap-2">
      <h3 id="other-vehicles-heading" className="text-xs font-medium text-gray-500">
        {others.length > 0 ? "Switch vehicle" : "Your vehicles"}
      </h3>
      <ul className="flex flex-wrap gap-1.5">
        {others.slice(0, SHOWN).map((vehicle) => (
          <li key={vehicle.id}>
            <Link
              href={`/account?vehicle=${vehicle.id}`}
              scroll={false}
              title={formatPlate(vehicle.registrationNumber)}
              className={chipClass}
            >
              <VehiclePhoto
                vehicle={vehicle}
                sizes="24px"
                className="aspect-square w-6 rounded-full"
              />
              <span className="font-semibold text-gray-900">{vehicle.modelName}</span>
            </Link>
          </li>
        ))}
        {others.length > SHOWN && (
          <li>
            <Link
              href="/account/vehicles"
              className={cn(chipClass, "pl-2.5 font-semibold text-navy-700")}
            >
              +{others.length - SHOWN} more
            </Link>
          </li>
        )}
        <li>
          <Link
            href="/account/vehicles/new"
            aria-label={others.length > 0 ? "Add a vehicle" : undefined}
            className={cn(
              chipClass,
              "border-dashed font-semibold text-navy-700",
              // With other vehicles beside it, just "+" so the row stays on one line.
              others.length > 0 ? "w-8 justify-center p-0" : "pl-2",
            )}
          >
            <Plus className="size-4" aria-hidden />
            {others.length === 0 && "Add another vehicle"}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
