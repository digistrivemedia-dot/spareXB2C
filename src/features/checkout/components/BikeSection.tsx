import { TriangleAlert, Wrench } from "lucide-react";
import { Controller, useFormContext, useWatch } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioCard } from "@/components/ui/RadioCard";
import { RadioGroup } from "@/components/ui/radio-group";
import { useCartStore } from "@/features/cart/store";
import { getFitStatus } from "@/features/catalog/utils";
import type { CheckoutValues } from "@/features/checkout/schema";
import type { MyBike } from "@/features/vehicles/types";
import { getBikeName } from "@/features/vehicles/utils";
import { INSTALLATION_FEE_IN_PAISE } from "@/lib/constants";
import { formatPrice, formatRegistration } from "@/lib/format";

/** Step 2: which of the customer's bikes the parts are for, and which parts to have fitted. */
export function BikeSection({ bikes }: { bikes: MyBike[] }) {
  const { control } = useFormContext<CheckoutValues>();
  const bikeId = useWatch({ control, name: "bikeId" });
  const items = useCartStore((state) => state.items);
  const setInstallation = useCartStore((state) => state.setInstallation);

  const bike = bikes.find((b) => b.id === bikeId);
  const misfits = bike ? items.filter((item) => getFitStatus(item.fitment, bike) === "no-fit") : [];
  const installable = items.filter((item) => item.isInstallable);

  return (
    <div className="grid gap-5">
      <Controller
        name="bikeId"
        control={control}
        render={({ field }) => (
          <RadioGroup
            value={field.value}
            onValueChange={field.onChange}
            aria-label="Bike for this order"
            className="gap-3 sm:grid-cols-2"
          >
            {bikes.map((b) => (
              <RadioCard key={b.id} value={b.id} id={`bike-${b.id}`}>
                <span className="block font-semibold text-gray-900">{getBikeName(b)}</span>
                <span className="block text-gray-500">
                  {formatRegistration(b.registrationNumber)} · {b.year}
                </span>
              </RadioCard>
            ))}
            <RadioCard value="" id="bike-none">
              <span className="block font-semibold text-gray-900">Not for a specific bike</span>
              <span className="block text-gray-500">Gifts, spares or another vehicle</span>
            </RadioCard>
          </RadioGroup>
        )}
      />

      {bike && misfits.length > 0 && (
        <p className="flex gap-2 rounded-lg bg-warning-50 p-3 text-sm text-gray-900">
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-warning-700" aria-hidden />
          {misfits.map((item) => item.name).join(", ")} {misfits.length === 1 ? "doesn't" : "don't"}{" "}
          fit your {getBikeName(bike)}.
        </p>
      )}

      {installable.length > 0 && (
        <div
          role="group"
          aria-labelledby="installation-heading"
          className="grid gap-2 border-t border-gray-200 pt-5"
        >
          <h3
            id="installation-heading"
            className="flex items-center gap-2 font-semibold text-gray-900"
          >
            <Wrench className="size-4 text-navy-700" aria-hidden />
            Installation at Kannali Garage
          </h3>
          <p className="text-sm text-gray-600">
            {formatPrice(INSTALLATION_FEE_IN_PAISE)} per part. We&apos;ll call you to book a slot
            once the parts arrive.
          </p>
          {installable.map((item) => (
            <div key={item.productId} className="flex min-h-11 items-center gap-3">
              <Checkbox
                id={`install-${item.productId}`}
                checked={item.withInstallation}
                onCheckedChange={(state) => setInstallation(item.productId, state === true)}
              />
              <Label htmlFor={`install-${item.productId}`} className="cursor-pointer font-normal">
                {item.name}
              </Label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
