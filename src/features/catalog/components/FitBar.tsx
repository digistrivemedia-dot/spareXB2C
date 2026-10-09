"use client";

import { Bike, CircleCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { type ProductFilters, productsHref } from "@/features/catalog/filters";
import { useVehicleStore } from "@/features/vehicles/store";
import type { MyBike, VehicleRef } from "@/features/vehicles/types";
import { getBikeName, isSameVehicle, toBikeParam, toSelectedBike } from "@/features/vehicles/utils";
import { cn } from "@/lib/utils";

type FitBarProps = {
  filters: ProductFilters;
  /** The bike the list is filtered for, from the URL; null when showing all parts. */
  fitBike: VehicleRef | null;
  myBikes: MyBike[];
};

const barClass = "flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border px-4 py-3 text-sm";

/** Says which bike the list is for, and lets the customer change it or show all parts. */
export function FitBar({ filters, fitBike, myBikes }: FitBarProps) {
  const router = useRouter();
  const selectedBike = useVehicleStore((state) => state.selectedBike);
  const hasHydrated = useVehicleStore((state) => state.hasHydrated);
  const selectBike = useVehicleStore((state) => state.selectBike);
  const openSelector = useVehicleStore((state) => state.setSelectorOpen);
  const syncedParam = useRef<string | null>(null);

  // When the URL's bike changes, it becomes the shop's selected bike, so every fit badge agrees with the list.
  // After that, if the customer picks another bike, the list follows their choice.
  useEffect(() => {
    if (!hasHydrated || !fitBike) return;
    const urlParam = toBikeParam(fitBike);
    if (syncedParam.current !== urlParam) {
      syncedParam.current = urlParam;
      if (selectedBike && isSameVehicle(selectedBike, fitBike)) return;
      const saved = myBikes.find((bike) => isSameVehicle(bike, fitBike));
      selectBike(saved ? toSelectedBike(saved) : { ...fitBike, myBikeId: null });
    } else if (selectedBike && !isSameVehicle(selectedBike, fitBike)) {
      router.replace(productsHref(filters, { bike: toBikeParam(selectedBike), fits: true }), {
        scroll: false,
      });
    }
  }, [hasHydrated, fitBike, selectedBike, myBikes, selectBike, filters, router]);

  if (fitBike) {
    return (
      <div className={cn(barClass, "border-success-600 bg-success-50")}>
        <CircleCheck className="size-5 shrink-0 text-success-700" aria-hidden />
        <p className="flex-1 text-gray-900">
          Showing parts that fit{" "}
          <span className="font-semibold">
            {getBikeName(fitBike)} ({fitBike.year})
          </span>
        </p>
        <Button variant="link" size="sm" onClick={() => openSelector(true)}>
          Change bike
        </Button>
        <Link
          href={productsHref(filters, { bike: undefined, fits: false })}
          className="text-sm font-semibold text-navy-700 hover:underline"
        >
          Show all parts
        </Link>
      </div>
    );
  }

  if (!hasHydrated) {
    return <div className="h-12 animate-pulse rounded-xl bg-gray-100" aria-hidden />;
  }

  return (
    <div className={cn(barClass, "border-gray-200 bg-white")}>
      <Bike className="size-5 shrink-0 text-navy-700" aria-hidden />
      {selectedBike ? (
        <>
          <p className="flex-1 text-gray-700">Showing all parts.</p>
          <Link
            href={productsHref(filters, { bike: toBikeParam(selectedBike), fits: true })}
            className="text-sm font-semibold text-navy-700 hover:underline"
          >
            Show only parts that fit your {getBikeName(selectedBike)}
          </Link>
        </>
      ) : (
        <>
          <p className="flex-1 text-gray-700">Select your bike to see only the parts that fit.</p>
          <Button variant="secondary" size="sm" onClick={() => openSelector(true)}>
            Select your bike
          </Button>
        </>
      )}
    </div>
  );
}
