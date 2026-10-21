"use client";

import { Bike, CircleCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { type ProductFilters, productsHref } from "@/features/catalog/filters";
import { useVehicleStore } from "@/features/vehicles/store";
import type { MyVehicle, VehicleRef } from "@/features/vehicles/types";
import {
  getVehicleName,
  isSameVehicle,
  toSelectedVehicle,
  toVehicleParam,
} from "@/features/vehicles/utils";
import { cn } from "@/lib/utils";

type FitBarProps = {
  filters: ProductFilters;
  /** The vehicle the list is filtered for, from the URL; null when showing all parts. */
  fitVehicle: VehicleRef | null;
  /** Parts that match the search and filters but don't fit `fitVehicle`. */
  hiddenCount: number;
  myVehicles: MyVehicle[];
};

const barClass = "flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border px-4 py-3 text-sm";

/**
 * With a vehicle selected the list shows only parts that fit it, unless the customer chose
 * "Show all parts". The bar says which vehicle, and lets them change it or see everything.
 */
export function FitBar({ filters, fitVehicle, hiddenCount, myVehicles }: FitBarProps) {
  const router = useRouter();
  const selectedVehicle = useVehicleStore((state) => state.selectedVehicle);
  const hasHydrated = useVehicleStore((state) => state.hasHydrated);
  const selectVehicle = useVehicleStore((state) => state.selectVehicle);
  const openSelector = useVehicleStore((state) => state.setSelectorOpen);
  const syncedParam = useRef<string | null>(null);
  // The selected vehicle lives in the browser, so the server can't filter the first render by it.
  const needsFitFilter = hasHydrated && !fitVehicle && !filters.showAll && selectedVehicle;

  useEffect(() => {
    if (!hasHydrated) return;
    const fitHref = (vehicle: VehicleRef) =>
      productsHref(filters, { vehicle: toVehicleParam(vehicle), fits: true, showAll: false });

    if (!fitVehicle) {
      if (selectedVehicle && !filters.showAll) {
        router.replace(fitHref(selectedVehicle), { scroll: false });
      }
      return;
    }
    // When the URL's vehicle changes, it becomes the shop's vehicle, so every fit badge agrees.
    // After that, if the customer picks another vehicle, the list follows their choice.
    const urlParam = toVehicleParam(fitVehicle);
    if (syncedParam.current !== urlParam) {
      syncedParam.current = urlParam;
      if (selectedVehicle && isSameVehicle(selectedVehicle, fitVehicle)) return;
      const saved = myVehicles.find((vehicle) => isSameVehicle(vehicle, fitVehicle));
      selectVehicle(saved ? toSelectedVehicle(saved) : { ...fitVehicle, myVehicleId: null });
    } else if (selectedVehicle && !isSameVehicle(selectedVehicle, fitVehicle)) {
      router.replace(fitHref(selectedVehicle), { scroll: false });
    }
  }, [hasHydrated, fitVehicle, selectedVehicle, myVehicles, selectVehicle, filters, router]);

  const showAllHref = productsHref(filters, { vehicle: undefined, fits: false, showAll: true });

  if (fitVehicle) {
    return (
      <div className={cn(barClass, "border-success-600 bg-success-50")}>
        <CircleCheck className="size-5 shrink-0 text-success-700" aria-hidden />
        <p className="flex-1 text-gray-900">
          Showing parts that fit{" "}
          <span className="font-semibold">
            {getVehicleName(fitVehicle)} ({fitVehicle.year})
          </span>
          {hiddenCount > 0 && (
            <span className="text-gray-600">
              {" "}
              · {hiddenCount} more {hiddenCount === 1 ? "part matches" : "parts match"} but
              {hiddenCount === 1 ? " doesn't" : " don't"} fit
            </span>
          )}
        </p>
        <Button variant="link" size="sm" onClick={() => openSelector(true)}>
          Change vehicle
        </Button>
        <Link href={showAllHref} className="text-sm font-semibold text-navy-700 hover:underline">
          Show all parts
        </Link>
      </div>
    );
  }

  if (!hasHydrated || needsFitFilter) {
    return <div className="h-12 animate-pulse rounded-xl bg-gray-100" aria-hidden />;
  }

  return (
    <div className={cn(barClass, "border-gray-200 bg-white")}>
      <Bike className="size-5 shrink-0 text-navy-700" aria-hidden />
      {selectedVehicle ? (
        <>
          <p className="flex-1 text-gray-700">
            Showing all parts, including ones that don&apos;t fit.
          </p>
          <Link
            href={productsHref(filters, {
              vehicle: toVehicleParam(selectedVehicle),
              fits: true,
              showAll: false,
            })}
            className="text-sm font-semibold text-navy-700 hover:underline"
          >
            Show only parts that fit your {getVehicleName(selectedVehicle)}
          </Link>
        </>
      ) : (
        <>
          <p className="flex-1 text-gray-700">
            Select your vehicle to see only the parts that fit.
          </p>
          <Button variant="secondary" size="sm" onClick={() => openSelector(true)}>
            Select your vehicle
          </Button>
        </>
      )}
    </div>
  );
}
