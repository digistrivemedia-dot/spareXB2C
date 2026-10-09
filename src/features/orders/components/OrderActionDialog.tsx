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
import { cancelOrderAction, requestReturnAction } from "@/features/orders/actions";
import { orderChangeSchema, type OrderChangeValues } from "@/features/orders/schema";
import { cancelReasons, returnReasons } from "@/features/orders/utils";

type OrderActionDialogProps = {
  kind: "cancel" | "return";
  orderId: string;
  orderNumber: string;
};

const copy = {
  cancel: {
    trigger: "Cancel order",
    title: "Cancel this order?",
    description: "Any payment you made is refunded to the same account within 5–7 working days.",
    submit: "Cancel order",
    done: "Order cancelled",
    reasons: cancelReasons,
    action: cancelOrderAction,
  },
  return: {
    trigger: "Return items",
    title: "Return this order",
    description: "We'll pick the parts up from your address and refund you once they're checked.",
    submit: "Request return",
    done: "Return requested. We'll call you to arrange the pickup.",
    reasons: returnReasons,
    action: requestReturnAction,
  },
};

/** Asks for a reason, then cancels the order or requests a return. */
export function OrderActionDialog({ kind, orderId, orderNumber }: OrderActionDialogProps) {
  const text = copy[kind];
  const [open, setOpen] = useState(false);
  const form = useForm<OrderChangeValues>({
    resolver: zodResolver(orderChangeSchema),
    defaultValues: { reason: "", details: "" },
  });

  async function onSubmit(values: OrderChangeValues) {
    const result = await text.action(orderId, values);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    setOpen(false);
    toast.success(text.done, { description: orderNumber });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={kind === "cancel" ? "destructive" : "secondary"}>{text.trigger}</Button>
      </DialogTrigger>
      <DialogContent className="max-h-dvh overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{text.title}</DialogTitle>
          <DialogDescription>{text.description}</DialogDescription>
        </DialogHeader>
        <form
          id={`${kind}-form`}
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
                  {text.reasons.map((reason, index) => (
                    <RadioCard key={reason} value={reason} id={`${kind}-reason-${index}`}>
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
                <FieldLabel htmlFor={`${kind}-details`}>Anything else? (optional)</FieldLabel>
                <Textarea {...field} id={`${kind}-details`} aria-invalid={fieldState.invalid} />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </form>
        <DialogFooter>
          <Button
            type="submit"
            form={`${kind}-form`}
            variant={kind === "cancel" ? "destructive" : "default"}
            disabled={form.formState.isSubmitting}
          >
            {text.submit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
