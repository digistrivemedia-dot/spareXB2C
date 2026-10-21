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
import { Field, FieldError, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { RadioCard } from "@/components/ui/RadioCard";
import { RadioGroup } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { cancelOrderAction } from "@/features/orders/actions";
import { orderChangeSchema, type OrderChangeValues } from "@/features/orders/schema";
import { cancelReasons } from "@/features/orders/utils";

type CancelOrderDialogProps = {
  orderId: string;
  orderNumber: string;
};

/** Asks for a reason, then cancels the order. */
export function CancelOrderDialog({ orderId, orderNumber }: CancelOrderDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<OrderChangeValues>({
    resolver: zodResolver(orderChangeSchema),
    defaultValues: { reason: "", details: "" },
  });

  async function onSubmit(values: OrderChangeValues) {
    const result = await cancelOrderAction(orderId, values);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    setOpen(false);
    toast.success("Order cancelled", { description: orderNumber });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Cancel order</Button>
      </DialogTrigger>
      <DialogContent className="max-h-dvh overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cancel this order?</DialogTitle>
          <DialogDescription>
            Any payment you made is refunded to the same account within 5–7 working days.
          </DialogDescription>
        </DialogHeader>
        <form
          id="cancel-form"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="grid gap-5"
        >
          <Controller
            name="reason"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldSet data-invalid={fieldState.invalid}>
                <FieldLegend variant="label">Reason</FieldLegend>
                <RadioGroup value={field.value} onValueChange={field.onChange} className="gap-2">
                  {cancelReasons.map((reason, index) => (
                    <RadioCard key={reason} value={reason} id={`cancel-reason-${index}`}>
                      {reason}
                    </RadioCard>
                  ))}
                </RadioGroup>
                <FieldError errors={[fieldState.error]} />
              </FieldSet>
            )}
          />
          <Controller
            name="details"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="cancel-details">Anything else? (optional)</FieldLabel>
                <Textarea {...field} id="cancel-details" aria-invalid={fieldState.invalid} />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </form>
        <DialogFooter>
          <Button
            type="submit"
            form="cancel-form"
            variant="destructive"
            disabled={form.formState.isSubmitting}
          >
            Cancel order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
