import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { lookupPin } from "@/features/location/api";
import { type PinFormValues, pinSchema } from "@/features/location/schema";
import { useLocationStore } from "@/features/location/store";

type PinFormProps = {
  onSaved: () => void;
  submitLabel?: string;
};

export function PinForm({ onSaved, submitLabel = "Apply" }: PinFormProps) {
  const id = useId();
  const setLocation = useLocationStore((state) => state.setLocation);
  const form = useForm<PinFormValues>({
    resolver: zodResolver(pinSchema),
    defaultValues: { pin: "" },
  });

  async function onSubmit({ pin }: PinFormValues) {
    const location = await lookupPin(pin);
    if (!location) {
      form.setError("pin", {
        message: "We couldn't find this PIN code. Please check it and try again.",
      });
      return;
    }
    if (!location.isServiceable) {
      form.setError("pin", {
        message: `Sorry, we don't deliver to ${location.city} yet.`,
      });
      return;
    }
    setLocation(location);
    toast.success(`Delivering to ${location.area}, ${location.city} ${location.pin}`);
    onSaved();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <Controller
        name="pin"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={id}>PIN code</FieldLabel>
            <div className="flex gap-2">
              <Input
                {...field}
                id={id}
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={6}
                placeholder="560066"
                aria-invalid={fieldState.invalid}
              />
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {submitLabel}
              </Button>
            </div>
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
    </form>
  );
}
