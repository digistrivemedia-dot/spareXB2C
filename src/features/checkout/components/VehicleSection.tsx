import { TriangleAlert } from "lucide-react";
import { Controller, useFormContext, useWatch } from "react-hook-form";

import { RadioGroup } from "@/components/ui/radio-group";
import { RadioCard } from "@/components/ui/RadioCard";
import { useCartStore } from "@/features/cart/store";
import { getFitStatus } from "@/features/catalog/utils";
import type { CheckoutValues } from "@/features/checkout/schema";
import type { MyVehicle } from "@/features/vehicles/types";
import { formatPlate, getVehicleName } from "@/features/vehicles/utils";

/** Step 2: which of the customer's vehicles the parts are for. */
export function VehicleSection({ vehicles }: { vehicles: MyVehicle[] }) {
  const { control } = useFormContext<CheckoutValues>();
  const vehicleId = useWatch({ control, name: "vehicleId" });
  const items = useCartStore((state) => state.items);

  const vehicle = vehicles.find((b) => b.id === vehicleId);
  const misfits = vehicle
    ? items.filter((item) => getFitStatus(item.fitment, vehicle) === "no-fit")
    : [];

  return (
    <div className="grid gap-5">
      <Controller
        name="vehicleId"
        control={control}
        render={({ field }) => (
          <RadioGroup
            value={field.value}
            onValueChange={field.onChange}
            aria-label="Vehicle for this order"
            className="gap-3 sm:grid-cols-2"
          >
            {vehicles.map((b) => (
              <RadioCard key={b.id} value={b.id} id={`vehicle-${b.id}`}>
                <span className="block font-semibold text-gray-900">{getVehicleName(b)}</span>
                <span className="block text-gray-500">
                  {formatPlate(b.registrationNumber)} · {b.year}
                </span>
              </RadioCard>
            ))}
            <RadioCard value="" id="vehicle-none">
              <span className="block font-semibold text-gray-900">Not for a specific vehicle</span>
              <span className="block text-gray-500">Gifts, spares or another vehicle</span>
            </RadioCard>
          </RadioGroup>
        )}
      />

      {vehicle && misfits.length > 0 && (
        <p className="flex gap-2 rounded-lg bg-warning-50 p-3 text-sm text-gray-900">
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-warning-700" aria-hidden />
          {misfits.map((item) => item.name).join(", ")} {misfits.length === 1 ? "doesn't" : "don't"}{" "}
          fit your {getVehicleName(vehicle)}.
        </p>
      )}
    </div>
  );
}
