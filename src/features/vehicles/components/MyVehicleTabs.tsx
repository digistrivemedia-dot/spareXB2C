import { Plus } from "lucide-react";
import Link from "next/link";

import type { MyVehicle } from "@/features/vehicles/types";
import { getVehicleName } from "@/features/vehicles/utils";
import { cn } from "@/lib/utils";

type MyVehicleTabsProps = {
  vehicles: MyVehicle[];
  currentVehicleId: string;
};

/** Switches the dashboard between the customer's vehicles (the dashboard makes it the shop's vehicle too). */
export function MyVehicleTabs({ vehicles, currentVehicleId }: MyVehicleTabsProps) {
  return (
    <nav aria-label="Your vehicles" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {vehicles.map((vehicle) => {
        const isCurrent = vehicle.id === currentVehicleId;
        return (
          <Link
            key={vehicle.id}
            href={`/account?vehicle=${vehicle.id}`}
            scroll={false}
            aria-current={isCurrent ? "page" : undefined}
            className={cn(
              "inline-flex h-11 shrink-0 items-center rounded-full border px-4 text-sm font-semibold whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:h-9",
              isCurrent
                ? "border-navy-800 bg-navy-800 text-white"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
            )}
          >
            {getVehicleName(vehicle)}
          </Link>
        );
      })}
      <Link
        href="/account/vehicles/new"
        className="inline-flex h-11 shrink-0 items-center gap-1 rounded-full border border-dashed border-gray-300 px-4 text-sm font-semibold whitespace-nowrap text-navy-700 hover:bg-navy-50 md:h-9"
      >
        <Plus className="size-4" aria-hidden />
        Add vehicle
      </Link>
    </nav>
  );
}
