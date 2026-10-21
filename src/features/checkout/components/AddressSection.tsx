import { Plus } from "lucide-react";
import { Controller, useFormContext, useWatch } from "react-hook-form";

import { FieldError } from "@/components/ui/field";
import { RadioCard } from "@/components/ui/RadioCard";
import { RadioGroup } from "@/components/ui/radio-group";
import { AddressFields } from "@/features/account/components/AddressFields";
import type { Address } from "@/features/account/types";
import { BillingFields } from "@/features/checkout/components/BillingFields";
import type { CheckoutValues } from "@/features/checkout/schema";
import { formatMobile } from "@/lib/format";

/** Step 1: where to deliver (a saved address or a new one), then billing and GST. */
export function AddressSection({ addresses }: { addresses: Address[] }) {
  const {
    control,
    formState: { errors },
  } = useFormContext<CheckoutValues>();
  const addressId = useWatch({ control, name: "addressId" });

  return (
    <div className="grid gap-5">
      <Controller
        name="addressId"
        control={control}
        render={({ field }) => (
          <RadioGroup
            value={field.value}
            onValueChange={field.onChange}
            aria-label="Delivery address"
            className="gap-3 sm:grid-cols-2"
          >
            {addresses.map((address) => (
              <RadioCard key={address.id} value={address.id} id={`address-${address.id}`}>
                <span className="flex items-center gap-2 font-semibold text-gray-900">
                  {address.name}
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                    {address.label}
                  </span>
                </span>
                <span className="mt-1 block text-gray-700">
                  {address.line1}, {address.area}, {address.city} {address.pin}
                </span>
                <span className="mt-1 block text-gray-500">{formatMobile(address.mobile)}</span>
              </RadioCard>
            ))}
            <RadioCard value="new" id="address-new">
              <span className="flex items-center gap-2 font-semibold text-navy-700">
                <Plus className="size-4" aria-hidden />
                Add a new address
              </span>
            </RadioCard>
          </RadioGroup>
        )}
      />
      <FieldError errors={[errors.addressId]} />
      {addressId === "new" && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <AddressFields />
        </div>
      )}

      <BillingFields addresses={addresses} />
    </div>
  );
}
