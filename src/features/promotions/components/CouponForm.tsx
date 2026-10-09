"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { TicketPercent, X } from "lucide-react";
import { useId, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { checkCouponAction } from "@/features/promotions/actions";
import { couponSchema, type CouponFormValues } from "@/features/promotions/schema";
import type { Coupon } from "@/features/promotions/types";
import { formatPrice } from "@/lib/format";

type CouponFormProps = {
  applied: Coupon | null;
  /** The applied coupon's discount on the current subtotal; 0 below its minimum order. */
  discountInPaise: number;
  subtotalInPaise: number;
  offers: Coupon[];
  onApply: (coupon: Coupon) => void;
  onRemove: () => void;
};

/** Enter a code or pick an offer; shows the applied coupon as a removable chip. */
export function CouponForm(props: CouponFormProps) {
  const { applied, discountInPaise, subtotalInPaise, offers, onApply, onRemove } = props;
  const id = useId();
  const [isApplyingOffer, startTransition] = useTransition();
  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: { code: "" },
  });

  async function apply(values: CouponFormValues) {
    const result = await checkCouponAction(values);
    if (!result.ok) {
      form.setError("code", { message: result.message });
      return;
    }
    onApply(result.coupon);
    form.reset();
    toast.success(`${result.coupon.code} applied`, { description: result.coupon.description });
  }

  if (applied) {
    const shortfall = applied.minOrderInPaise - subtotalInPaise;
    return (
      <div className="grid gap-1">
        <div className="flex items-center gap-2 rounded-full border border-success-600 bg-success-50 py-1 pr-1 pl-3 text-sm">
          <TicketPercent className="size-4 text-success-700" aria-hidden />
          <span className="flex-1 font-semibold text-success-700">
            {applied.code} applied
            {discountInPaise > 0 && ` · −${formatPrice(discountInPaise)}`}
          </span>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove coupon ${applied.code}`}
            className="flex size-9 items-center justify-center rounded-full text-gray-600 outline-none hover:bg-success-600/10 focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
        {shortfall > 0 && (
          <p className="text-sm text-warning-700">
            Add {formatPrice(shortfall)} more to use {applied.code}.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      <form onSubmit={form.handleSubmit(apply)} noValidate className="grid gap-1.5">
        <Label htmlFor={id}>Coupon code</Label>
        <div className="flex gap-2">
          <Input
            id={id}
            autoComplete="off"
            className="uppercase"
            aria-invalid={Boolean(form.formState.errors.code)}
            {...form.register("code")}
          />
          <Button type="submit" variant="secondary" disabled={form.formState.isSubmitting}>
            Apply
          </Button>
        </div>
        <FieldError errors={[form.formState.errors.code]} />
      </form>
      {offers.length > 0 && (
        <ul className="grid gap-2" aria-label="Available offers">
          {offers.map((offer) => (
            <li key={offer.code} className="flex items-center justify-between gap-3 text-sm">
              <span className="text-gray-700">
                <span className="font-semibold text-gray-900">{offer.code}</span> ·{" "}
                {offer.description}
              </span>
              <Button
                variant="link"
                size="sm"
                disabled={form.formState.isSubmitting || isApplyingOffer}
                onClick={() => startTransition(() => apply({ code: offer.code }))}
              >
                Apply
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
