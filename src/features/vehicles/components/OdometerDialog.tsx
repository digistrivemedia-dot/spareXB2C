"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { updateOdometerAction } from "@/features/vehicles/actions";
import { type OdometerFormValues, odometerSchema } from "@/features/vehicles/schema";
import { formatDate, formatKm } from "@/lib/format";

type OdometerDialogProps = {
  bikeId: string;
  bikeName: string;
  currentKm: number;
  updatedAt: string;
};

export function OdometerDialog({ bikeId, bikeName, currentKm, updatedAt }: OdometerDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<OdometerFormValues>({
    resolver: zodResolver(odometerSchema(currentKm)),
    defaultValues: { km: String(currentKm) },
  });

  async function onSubmit(values: OdometerFormValues) {
    const result = await updateOdometerAction(bikeId, values);
    if (!result.ok) {
      form.setError("km", { message: result.message });
      return;
    }
    setOpen(false);
    toast.success(`Odometer updated to ${formatKm(Number(values.km))}`);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) form.reset({ km: String(currentKm) });
      }}
    >
      <DialogTrigger asChild>
        <Button variant="link" size="sm" className="h-auto md:h-auto">
          Update
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update odometer</DialogTitle>
          <DialogDescription>
            Keeps service reminders for your {bikeName} accurate.
          </DialogDescription>
        </DialogHeader>
        <form id="odometer-form" onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <Controller
            name="km"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="odometer-km">Current reading (km)</FieldLabel>
                <Input
                  {...field}
                  id="odometer-km"
                  inputMode="numeric"
                  autoComplete="off"
                  aria-invalid={fieldState.invalid}
                />
                <FieldDescription>
                  Last updated {formatDate(updatedAt)} at {formatKm(currentKm)}.
                </FieldDescription>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </form>
        <DialogFooter>
          <Button type="submit" form="odometer-form" disabled={form.formState.isSubmitting}>
            Save reading
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
