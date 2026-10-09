"use client";

import { Bike, ChevronDown } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

import { HeaderAction } from "@/components/layout/HeaderAction";
import { BikeSelectorDialog } from "@/features/vehicles/components/BikeSelectorDialog";
import { useVehicleStore } from "@/features/vehicles/store";
import type { MyBike, SelectedBike, VehicleCatalog } from "@/features/vehicles/types";
import { getBikeName, toSelectedBike } from "@/features/vehicles/utils";

type BikeSwitcherProps = {
  myBikes: MyBike[];
  catalog: VehicleCatalog;
};

/** The "My bike" control in the header: shows the bike every fit check uses, and lets the customer switch or add one. */
export function BikeSwitcher({ myBikes, catalog }: BikeSwitcherProps) {
  const open = useVehicleStore((state) => state.isSelectorOpen);
  const setOpen = useVehicleStore((state) => state.setSelectorOpen);
  const selectedBike = useVehicleStore((state) => state.selectedBike);
  const hasHydrated = useVehicleStore((state) => state.hasHydrated);
  const selectBike = useVehicleStore((state) => state.selectBike);

  // A signed-in customer starts with their default bike selected.
  useEffect(() => {
    const defaultBike = myBikes.find((bike) => bike.isDefault);
    if (hasHydrated && !selectedBike && defaultBike) selectBike(toSelectedBike(defaultBike));
  }, [hasHydrated, selectedBike, myBikes, selectBike]);

  function choose(bike: SelectedBike) {
    selectBike(bike);
    setOpen(false);
    toast.success(`Showing parts for your ${getBikeName(bike)}`);
  }

  return (
    <>
      <HeaderAction
        variant="pill"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className="min-w-0 shrink"
      >
        <Bike className="size-5 shrink-0" aria-hidden />
        <span className="flex min-w-0 flex-col items-start leading-tight">
          <span className="hidden text-xs font-normal text-navy-100 lg:block">My bike</span>
          {hasHydrated ? (
            <span className="max-w-full truncate font-semibold sm:max-w-40">
              {selectedBike ? (
                <>
                  {/* Model only on small phones, so the header fits on one row. */}
                  <span className="sm:hidden">{selectedBike.modelName}</span>
                  <span className="hidden sm:inline">{getBikeName(selectedBike)}</span>
                </>
              ) : (
                "Select bike"
              )}
            </span>
          ) : (
            <span
              className="my-0.5 block h-4 w-20 animate-pulse rounded bg-navy-600"
              aria-label="Loading your bike"
            />
          )}
        </span>
        <ChevronDown className="hidden size-4 lg:block" aria-hidden />
      </HeaderAction>
      <BikeSelectorDialog
        open={open}
        onOpenChange={setOpen}
        myBikes={myBikes}
        catalog={catalog}
        currentMyBikeId={selectedBike?.myBikeId ?? null}
        onChoose={choose}
      />
    </>
  );
}
