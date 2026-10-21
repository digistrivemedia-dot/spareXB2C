"use client";

import { ChevronDown } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

import { HeaderAction } from "@/components/layout/HeaderAction";
import { VehicleSelectorDialog } from "@/features/vehicles/components/VehicleSelectorDialog";
import { VehicleTypeIcon } from "@/features/vehicles/components/VehicleTypeIcon";
import { useVehicleStore } from "@/features/vehicles/store";
import type { MyVehicle, SelectedVehicle, VehicleCatalog } from "@/features/vehicles/types";
import { getVehicleName, toSelectedVehicle } from "@/features/vehicles/utils";

type VehicleSwitcherProps = {
  myVehicles: MyVehicle[];
  catalog: VehicleCatalog;
};

/** The "My vehicle" control in the header: shows the vehicle every fit check uses, and lets the customer switch or add one. */
export function VehicleSwitcher({ myVehicles, catalog }: VehicleSwitcherProps) {
  const open = useVehicleStore((state) => state.isSelectorOpen);
  const setOpen = useVehicleStore((state) => state.setSelectorOpen);
  const selectedVehicle = useVehicleStore((state) => state.selectedVehicle);
  const hasHydrated = useVehicleStore((state) => state.hasHydrated);
  const selectVehicle = useVehicleStore((state) => state.selectVehicle);

  // A signed-in customer starts with their default vehicle selected.
  useEffect(() => {
    const defaultVehicle = myVehicles.find((vehicle) => vehicle.isDefault);
    if (hasHydrated && !selectedVehicle && defaultVehicle)
      selectVehicle(toSelectedVehicle(defaultVehicle));
  }, [hasHydrated, selectedVehicle, myVehicles, selectVehicle]);

  function choose(vehicle: SelectedVehicle) {
    selectVehicle(vehicle);
    setOpen(false);
    toast.success(`Showing parts for your ${getVehicleName(vehicle)}`);
  }

  return (
    <>
      <HeaderAction
        variant="pill"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className="min-w-0 shrink"
      >
        <VehicleTypeIcon type={selectedVehicle?.type} className="size-5 shrink-0" />
        <span className="flex min-w-0 flex-col items-start leading-tight">
          <span className="hidden text-xs font-normal text-navy-100 lg:block">My vehicle</span>
          {hasHydrated ? (
            <span className="max-w-full truncate font-semibold sm:max-w-40">
              {selectedVehicle ? (
                <>
                  {/* Model only on small phones, so the header fits on one row. */}
                  <span className="sm:hidden">{selectedVehicle.modelName}</span>
                  <span className="hidden sm:inline">{getVehicleName(selectedVehicle)}</span>
                </>
              ) : (
                "Select vehicle"
              )}
            </span>
          ) : (
            <span
              className="my-0.5 block h-4 w-20 animate-pulse rounded bg-navy-600"
              aria-label="Loading your vehicle"
            />
          )}
        </span>
        <ChevronDown className="hidden size-4 lg:block" aria-hidden />
      </HeaderAction>
      <VehicleSelectorDialog
        open={open}
        onOpenChange={setOpen}
        myVehicles={myVehicles}
        catalog={catalog}
        currentMyVehicleId={selectedVehicle?.myVehicleId ?? null}
        onChoose={choose}
      />
    </>
  );
}
