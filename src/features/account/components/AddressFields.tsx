import { useFormContext } from "react-hook-form";

import { TextField } from "@/components/ui/TextField";
import type { AddressFieldsValues } from "@/features/account/schema";
import { lookupPin } from "@/features/location/api";

/**
 * Name, mobile and postal address, for any form that keeps them under `address`
 * (checkout's new address and the address book). City and state fill in from the PIN code.
 */
export function AddressFields() {
  const {
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<{ address: AddressFieldsValues }>();
  const fieldErrors = errors.address;

  async function fillFromPin(pin: string) {
    if (!/^[1-9]\d{5}$/.test(pin)) return;
    const location = await lookupPin(pin);
    if (!location) return;
    setValue("address.city", location.city, { shouldValidate: true });
    setValue("address.state", location.state, { shouldValidate: true });
    if (!getValues("address.area")) {
      setValue("address.area", location.area, { shouldValidate: true });
    }
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <TextField
        label="Full name"
        autoComplete="name"
        error={fieldErrors?.name?.message}
        {...register("address.name")}
      />
      <TextField
        label="Mobile number"
        inputMode="numeric"
        autoComplete="tel-national"
        maxLength={10}
        hint="For delivery updates"
        error={fieldErrors?.mobile?.message}
        {...register("address.mobile")}
      />
      <TextField
        label="PIN code"
        inputMode="numeric"
        autoComplete="postal-code"
        maxLength={6}
        hint="City and state fill in automatically"
        error={fieldErrors?.pin?.message}
        {...register("address.pin", { onChange: (event) => fillFromPin(event.target.value) })}
      />
      <TextField
        label="Area or locality"
        autoComplete="address-level3"
        error={fieldErrors?.area?.message}
        {...register("address.area")}
      />
      <div className="sm:col-span-2">
        <TextField
          label="House no., building and street"
          autoComplete="street-address"
          error={fieldErrors?.line1?.message}
          {...register("address.line1")}
        />
      </div>
      <TextField
        label="City"
        autoComplete="address-level2"
        error={fieldErrors?.city?.message}
        {...register("address.city")}
      />
      <TextField
        label="State"
        autoComplete="address-level1"
        error={fieldErrors?.state?.message}
        {...register("address.state")}
      />
    </div>
  );
}
