"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { FieldError } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { type PickedPhoto, PhotoUpload } from "@/components/ui/PhotoUpload";
import { RadioCard } from "@/components/ui/RadioCard";
import { RadioGroup } from "@/components/ui/radio-group";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Textarea } from "@/components/ui/textarea";
import { OrderAddress } from "@/features/orders/components/OrderAddress";
import type { Order } from "@/features/orders/types";
import { getPaymentLabel, getReturnableQuantities } from "@/features/orders/utils";
import { requestReturnAction } from "@/features/returns/actions";
import { ReturnItemPicker } from "@/features/returns/components/ReturnItemPicker";
import { returnRequestSchema, type ReturnRequestValues } from "@/features/returns/schema";
import { getRefundAmount, reasonsNeedingPhotos, returnReasons } from "@/features/returns/utils";
import { savePickedPhotos } from "@/features/uploads/save-photos";
import { formatPrice } from "@/lib/format";

/** Which parts, why, photos, then the pickup address and refund it leads to. */
export function ReturnForm({ order }: { order: Order }) {
  const router = useRouter();
  const returnable = getReturnableQuantities(order);
  const [photos, setPhotos] = useState<PickedPhoto[]>([]);
  const [photoError, setPhotoError] = useState<string>();
  const form = useForm<ReturnRequestValues>({
    resolver: zodResolver(returnRequestSchema),
    defaultValues: { quantities: {}, reason: "", details: "" },
  });
  const [quantities, reason] = useWatch({ control: form.control, name: ["quantities", "reason"] });
  const needsPhotos = reasonsNeedingPhotos.includes(reason);
  const refund = getRefundAmount(
    order.items.map((item) => ({ ...item, quantity: quantities[item.id] ?? 0 })),
  );
  const { errors, isSubmitting } = form.formState;

  async function onSubmit(values: ReturnRequestValues) {
    if (needsPhotos && photos.length === 0) {
      setPhotoError("Add a photo of the part, so we can check it before the pickup.");
      return;
    }
    const saved = await savePickedPhotos(photos, `Photo for a return on ${order.number}`);
    if ("error" in saved) return toast.error(saved.error);
    const result = await requestReturnAction(order.id, values, saved.photos);
    if (!result.ok) return toast.error(result.message);
    toast.success("Return requested", { description: "We'll check it and confirm the pickup." });
    router.push(`/account/returns/${result.returnId}`);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="grid gap-6">
      <Card aria-labelledby="return-items-heading">
        <SectionHeader id="return-items-heading" title="Which parts?" />
        <Controller
          name="quantities"
          control={form.control}
          render={({ field }) => (
            <ReturnItemPicker
              items={order.items}
              returnable={returnable}
              quantities={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <FieldError errors={[errors.quantities]} />
      </Card>

      <Card aria-labelledby="return-reason-heading" className="grid gap-5">
        <SectionHeader id="return-reason-heading" title="Why are you returning it?" />
        <Controller
          name="reason"
          control={form.control}
          render={({ field, fieldState }) => (
            <div className="grid gap-2">
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                aria-labelledby="return-reason-heading"
                className="gap-2 sm:grid-cols-2"
              >
                {returnReasons.map((option, index) => (
                  <RadioCard key={option} value={option} id={`return-reason-${index}`}>
                    {option}
                  </RadioCard>
                ))}
              </RadioGroup>
              <FieldError errors={[fieldState.error]} />
            </div>
          )}
        />
        <div className="grid gap-2">
          <Label htmlFor="return-details">Tell us more (optional)</Label>
          <Textarea
            id="return-details"
            maxLength={300}
            placeholder="E.g. the box says RC 390, but my bike is a Duke 200"
            {...form.register("details")}
          />
          <FieldError errors={[errors.details]} />
        </div>
        <PhotoUpload
          id="return-photos"
          label={needsPhotos ? "Photos of the part" : "Photos (optional)"}
          hint="Show the damage or the label on the box. Up to 4 photos."
          value={photos}
          onChange={(next) => {
            setPhotos(next);
            setPhotoError(undefined);
          }}
          error={photoError}
        />
      </Card>

      <Card aria-labelledby="return-summary-heading" className="grid gap-5 md:grid-cols-2">
        <div>
          <h2 id="return-summary-heading" className="mb-2 font-semibold text-gray-900">
            We&apos;ll pick it up from
          </h2>
          <OrderAddress address={order.deliveryAddress} />
        </div>
        <div className="grid content-start gap-1 text-sm">
          <h3 className="font-semibold text-gray-900">Your refund</h3>
          {refund > 0 ? (
            <p className="text-2xl font-semibold text-gray-900 tabular-nums">
              {formatPrice(refund)}
            </p>
          ) : (
            <p className="text-gray-700">Choose the parts above to see it.</p>
          )}
          <p className="text-gray-600">
            To your {getPaymentLabel(order.payment)} account, once the parts reach us and pass a
            check. You also get a credit note.
          </p>
        </div>
      </Card>

      <Button type="submit" size="lg" disabled={isSubmitting} className="sm:w-fit">
        {isSubmitting ? "Sending…" : "Request return"}
      </Button>
    </form>
  );
}
