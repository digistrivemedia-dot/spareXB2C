import { Plus } from "lucide-react";
import Link from "next/link";
import { useId } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MyVehicleList } from "@/features/vehicles/components/MyVehicleList";
import { VehiclePicker } from "@/features/vehicles/components/VehiclePicker";
import type { MyVehicle, SelectedVehicle, VehicleCatalog } from "@/features/vehicles/types";
import { toSelectedVehicle } from "@/features/vehicles/utils";

type VehicleSelectorDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  myVehicles: MyVehicle[];
  catalog: VehicleCatalog;
  /** The saved vehicle to mark as current, if any. */
  currentMyVehicleId: string | null;
  onChoose: (vehicle: SelectedVehicle) => void;
};

/** Pick one of the customer's vehicles, or any vehicle from the vehicle master. */
export function VehicleSelectorDialog({
  open,
  onOpenChange,
  myVehicles,
  catalog,
  currentMyVehicleId,
  onChoose,
}: VehicleSelectorDialogProps) {
  const id = useId();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-dvh overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Select your vehicle</DialogTitle>
          <DialogDescription>Every part will show whether it fits.</DialogDescription>
        </DialogHeader>

        {myVehicles.length > 0 && (
          <section aria-labelledby={`${id}-mine`} className="grid gap-3">
            <h3 id={`${id}-mine`} className="text-sm font-semibold text-gray-900">
              Your vehicles
            </h3>
            <MyVehicleList
              vehicles={myVehicles}
              selectedVehicleId={currentMyVehicleId}
              onSelect={(vehicle) => onChoose(toSelectedVehicle(vehicle))}
            />
          </section>
        )}

        <section aria-labelledby={`${id}-other`} className="grid gap-3">
          <h3 id={`${id}-other`} className="text-sm font-semibold text-gray-900">
            {myVehicles.length > 0 ? "Or choose another vehicle" : "Choose your vehicle"}
          </h3>
          <VehiclePicker
            catalog={catalog}
            submitLabel="Use this vehicle"
            onSubmit={(vehicle) => onChoose({ ...vehicle, myVehicleId: null })}
          />
        </section>

        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <Link
            href="/account/vehicles/new"
            onClick={() => onOpenChange(false)}
            className="inline-flex items-center gap-1.5 rounded text-sm font-semibold text-navy-700 hover:underline"
          >
            <Plus className="size-4" aria-hidden />
            Add a vehicle to your garage
          </Link>
          <Link
            href="/account/enquiries/new?reason=vehicle-not-listed"
            onClick={() => onOpenChange(false)}
            className="rounded text-sm font-semibold text-navy-700 hover:underline"
          >
            Vehicle not listed?
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
