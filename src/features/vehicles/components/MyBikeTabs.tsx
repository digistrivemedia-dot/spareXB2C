"use client";

import { Plus } from "lucide-react";
import Link from "next/link";

import { useVehicleStore } from "@/features/vehicles/store";
import type { MyBike } from "@/features/vehicles/types";
import { getBikeName, toSelectedBike } from "@/features/vehicles/utils";
import { cn } from "@/lib/utils";

type MyBikeTabsProps = {
  bikes: MyBike[];
  currentBikeId: string;
};

/** Switches the dashboard between the customer's bikes, and makes the chosen one the shop's fit bike. */
export function MyBikeTabs({ bikes, currentBikeId }: MyBikeTabsProps) {
  const selectBike = useVehicleStore((state) => state.selectBike);

  return (
    <nav aria-label="Your bikes" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {bikes.map((bike) => {
        const isCurrent = bike.id === currentBikeId;
        return (
          <Link
            key={bike.id}
            href={`/account?bike=${bike.id}`}
            scroll={false}
            onClick={() => selectBike(toSelectedBike(bike))}
            aria-current={isCurrent ? "page" : undefined}
            className={cn(
              "inline-flex h-11 shrink-0 items-center rounded-full border px-4 text-sm font-semibold whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:h-9",
              isCurrent
                ? "border-navy-800 bg-navy-800 text-white"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
            )}
          >
            {getBikeName(bike)}
          </Link>
        );
      })}
      <Link
        href="/account/bikes/new"
        className="inline-flex h-11 shrink-0 items-center gap-1 rounded-full border border-dashed border-gray-300 px-4 text-sm font-semibold whitespace-nowrap text-navy-700 hover:bg-navy-50 md:h-9"
      >
        <Plus className="size-4" aria-hidden />
        Add bike
      </Link>
    </nav>
  );
}
