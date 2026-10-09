import { useFormContext } from "react-hook-form";

import { TextField } from "@/components/ui/TextField";
import type { CheckoutValues } from "@/features/checkout/schema";
import { lookupPin } from "@/features/location/api";

/** The "Add a new address" form. City and state fill in from the PIN code. */
export function NewAddressFields() {
  const {
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<CheckoutValues>();
  const fieldErrors = errors.newAddress;

  async function fillFromPin(pin: string) {
    if (!/^[1-9]\d{5}$/.test(pin)) return;
    const location = await lookupPin(pin);
    if (!location) return;
    setValue("newAddress.city", location.city, { shouldValidate: true });
    setValue("newAddress.state", location.state, { shouldValidate: true });
    if (!getValues("newAddress.area")) {
      setValue("newAddress.area", location.area, { shouldValidate: true });
    }
  }

  return (
    <div className="mt-4 grid gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:grid-cols-2">
      <TextField
        label="Full name"
        autoComplete="name"
        error={fieldErrors?.name?.message}
        {...register("newAddress.name")}
      />
      <TextField
        label="Mobile number"
        inputMode="numeric"
        autoComplete="tel-national"
        maxLength={10}
        hint="For delivery updates"
        error={fieldErrors?.mobile?.message}
        {...register("newAddress.mobile")}
      />
      <TextField
        label="PIN code"
        inputMode="numeric"
        autoComplete="postal-code"
        maxLength={6}
        hint="City and state fill in automatically"
        error={fieldErrors?.pin?.message}
        {...register("newAddress.pin", { onChange: (event) => fillFromPin(event.target.value) })}
      />
      <TextField
        label="Area or locality"
        autoComplete="address-level3"
        error={fieldErrors?.area?.message}
        {...register("newAddress.area")}
      />
      <div className="sm:col-span-2">
        <TextField
          label="House no., building and street"
          autoComplete="street-address"
          error={fieldErrors?.line1?.message}
          {...register("newAddress.line1")}
        />
      </div>
      <TextField
        label="City"
        autoComplete="address-level2"
        error={fieldErrors?.city?.message}
        {...register("newAddress.city")}
      />
      <TextField
        label="State"
        autoComplete="address-level1"
        error={fieldErrors?.state?.message}
        {...register("newAddress.state")}
      />
    </div>
  );
}
