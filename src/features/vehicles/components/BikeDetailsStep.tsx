import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/TextField";
import { bikeDetailsSchema, type BikeDetailsValues } from "@/features/vehicles/schema";

type BikeDetailsStepProps = {
  onSubmit: (values: BikeDetailsValues) => Promise<string | null>;
};

/** Registration number (required) and odometer (optional). Returns a server error, if any. */
export function BikeDetailsStep({ onSubmit }: BikeDetailsStepProps) {
  const form = useForm<BikeDetailsValues>({
    resolver: zodResolver(bikeDetailsSchema),
    defaultValues: { registrationNumber: "", odometerKm: "" },
  });

  async function submit(values: BikeDetailsValues) {
    const error = await onSubmit(values);
    if (error) form.setError("registrationNumber", { message: error });
  }

  return (
    <form onSubmit={form.handleSubmit(submit)} noValidate className="grid gap-4">
      <TextField
        label="Registration number"
        placeholder="KA 03 MX 4521"
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
        {form.formState.isSubmitting ? "Adding…" : "Add bike"}
      </Button>
    </form>
  );
}
