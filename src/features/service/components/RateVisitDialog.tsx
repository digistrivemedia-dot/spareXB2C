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
import { Textarea } from "@/components/ui/textarea";
import { rateServiceVisitAction } from "@/features/service/actions";
import { StarRatingInput } from "@/features/service/components/StarRatingInput";
import { visitReviewSchema, type VisitReviewValues } from "@/features/service/schema";
import { formatDate } from "@/lib/format";

type RateVisitDialogProps = {
  recordId: string;
  garageName: string;
  visitDate: string;
};

export function RateVisitDialog({ recordId, garageName, visitDate }: RateVisitDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<VisitReviewValues>({
    resolver: zodResolver(visitReviewSchema),
    defaultValues: { rating: 0, comment: "" },
  });

  async function onSubmit(values: VisitReviewValues) {
    const result = await rateServiceVisitAction(recordId, values);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    setOpen(false);
    form.reset();
    toast.success("Thanks for rating your visit", {
      description: "It helps the garage and other riders.",
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          Rate your visit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rate your visit</DialogTitle>
          <DialogDescription>
            {garageName} · {formatDate(visitDate)}
          </DialogDescription>
        </DialogHeader>
        <form
          id="rate-visit-form"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="grid gap-5"
        >
          <Controller
            name="rating"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldSet data-invalid={fieldState.invalid}>
                <FieldLegend variant="label">How was the service?</FieldLegend>
                <StarRatingInput
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  invalid={fieldState.invalid}
                />
                <FieldError errors={[fieldState.error]} />
              </FieldSet>
            )}
          />
          <Controller
            name="comment"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="visit-comment">Tell us more (optional)</FieldLabel>
                <Textarea
                  {...field}
                  id="visit-comment"
                  placeholder="What went well, and what could be better?"
                  aria-invalid={fieldState.invalid}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </form>
        <DialogFooter>
          <Button type="submit" form="rate-visit-form" disabled={form.formState.isSubmitting}>
            Submit rating
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
