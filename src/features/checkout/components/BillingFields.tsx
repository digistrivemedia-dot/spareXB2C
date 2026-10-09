import { Controller, useFormContext, useWatch } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { FieldError } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/SelectField";
import { TextField } from "@/components/ui/TextField";
import type { Address } from "@/features/account/types";
import type { CheckoutValues } from "@/features/checkout/schema";

/** Billing address (same as delivery by default) and the optional GST invoice. */
export function BillingFields({ addresses }: { addresses: Address[] }) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<CheckoutValues>();
  const [billingSame, wantsGst] = useWatch({
    control,
    name: ["billingSameAsDelivery", "wantsGstInvoice"],
  });

  return (
    <div className="grid gap-3 border-t border-gray-200 pt-5">
      <Controller
        name="billingSameAsDelivery"
        control={control}
        render={({ field }) => (
          <div className="flex min-h-11 items-center gap-3">
            <Checkbox
              id="billing-same"
              checked={field.value}
              onCheckedChange={(state) => field.onChange(state === true)}
            />
            <Label htmlFor="billing-same" className="cursor-pointer font-normal">
              Billing address same as delivery
            </Label>
          </div>
        )}
      />
      {!billingSame && (
        <Controller
          name="billingAddressId"
          control={control}
          render={({ field, fieldState }) => (
            <div className="grid gap-1 sm:max-w-sm">
              <SelectField
                id="billing-address"
                label="Billing address"
                placeholder="Choose a saved address"
                value={field.value || undefined}
                options={addresses.map((a) => ({ value: a.id, label: `${a.label}: ${a.line1}` }))}
                onChange={field.onChange}
              />
              <FieldError errors={[fieldState.error]} />
            </div>
          )}
        />
      )}

      <Controller
        name="wantsGstInvoice"
        control={control}
        render={({ field }) => (
          <div className="flex min-h-11 items-center gap-3">
            <Checkbox
              id="wants-gst"
              checked={field.value}
              onCheckedChange={(state) => field.onChange(state === true)}
            />
            <Label htmlFor="wants-gst" className="cursor-pointer font-normal">
              Need a GST invoice? (for business purchases)
            </Label>
          </div>
        )}
      />
      {wantsGst && (
        <div className="sm:max-w-sm">
          <TextField
            label="GSTIN"
            autoComplete="off"
            maxLength={15}
            className="uppercase"
            hint="The invoice will show your business GSTIN so you can claim input tax credit."
            error={errors.gstin?.message}
            {...register("gstin")}
          />
        </div>
      )}
    </div>
  );
}
