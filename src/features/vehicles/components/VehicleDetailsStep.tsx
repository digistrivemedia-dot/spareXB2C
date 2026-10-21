import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/TextField";
import { vehicleDetailsSchema, type VehicleDetailsValues } from "@/features/vehicles/schema";

type VehicleDetailsStepProps = {
  onSubmit: (values: VehicleDetailsValues) => Promise<string | null>;
};

/** Number plate and odometer, both optional. Returns a server error, if any. */
export function VehicleDetailsStep({ onSubmit }: VehicleDetailsStepProps) {
  const form = useForm<VehicleDetailsValues>({
    resolver: zodResolver(vehicleDetailsSchema),
    defaultValues: { registrationNumber: "", odometerKm: "" },
  });

  async function submit(values: VehicleDetailsValues) {
    const error = await onSubmit(values);
    if (error) form.setError("registrationNumber", { message: error });
  }

  return (
    <form onSubmit={form.handleSubmit(submit)} noValidate className="grid gap-4">
      <TextField
        label="Number plate (optional)"
        placeholder="KA 03 MX 4521"
        hint="New vehicle without a plate yet? Leave it empty and add it later."
        autoComplete="off"
        className="uppercase"
        autoFocus
        error={form.formState.errors.registrationNumber?.message}
        {...form.register("registrationNumber")}
      />
      <TextField
        label="Odometer reading (km, optional)"
        inputMode="numeric"
        placeholder="18420"
        hint="Helps us remind you when the next service is due."
        error={form.formState.errors.odometerKm?.message}
        {...form.register("odometerKm")}
      />
      <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Adding…" : "Add vehicle"}
      </Button>
    </form>
  );
}
