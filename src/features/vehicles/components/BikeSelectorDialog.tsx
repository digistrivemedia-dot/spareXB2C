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
import { MyBikeList } from "@/features/vehicles/components/MyBikeList";
import { VehiclePicker } from "@/features/vehicles/components/VehiclePicker";
import type { MyBike, SelectedBike, VehicleCatalog } from "@/features/vehicles/types";
import { toSelectedBike } from "@/features/vehicles/utils";

type BikeSelectorDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  myBikes: MyBike[];
  catalog: VehicleCatalog;
  /** The saved bike to mark as current, if any. */
  currentMyBikeId: string | null;
  onChoose: (bike: SelectedBike) => void;
};

/** Pick one of the customer's bikes, or any bike from the vehicle master. */
export function BikeSelectorDialog({
  open,
  onOpenChange,
  myBikes,
  catalog,
  currentMyBikeId,
  onChoose,
}: BikeSelectorDialogProps) {
  const id = useId();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-dvh overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Select your bike</DialogTitle>
          <DialogDescription>Every part will show whether it fits.</DialogDescription>
        </DialogHeader>

        {myBikes.length > 0 && (
          <section aria-labelledby={`${id}-mine`} className="grid gap-3">
            <h3 id={`${id}-mine`} className="text-sm font-semibold text-gray-900">
              Your bikes
            </h3>
            <MyBikeList
              bikes={myBikes}
              selectedBikeId={currentMyBikeId}
              onSelect={(bike) => onChoose(toSelectedBike(bike))}
            />
          </section>
        )}

        <section aria-labelledby={`${id}-other`} className="grid gap-3">
          <h3 id={`${id}-other`} className="text-sm font-semibold text-gray-900">
            {myBikes.length > 0 ? "Or choose another bike" : "Choose your bike"}
          </h3>
          <VehiclePicker
            catalog={catalog}
            submitLabel="Use this bike"
            onSubmit={(vehicle) => onChoose({ ...vehicle, myBikeId: null })}
          />
        </section>

        <Link
          href="/account/bikes/new"
          onClick={() => onOpenChange(false)}
          className="inline-flex items-center gap-1.5 justify-self-start rounded text-sm font-semibold text-navy-700 hover:underline"
        >
          <Plus className="size-4" aria-hidden />
          Add a bike to your garage
        </Link>
      </DialogContent>
    </Dialog>
  );
}
