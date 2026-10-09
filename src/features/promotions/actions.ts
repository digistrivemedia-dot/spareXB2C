"use server";

import { checkCoupon } from "@/features/promotions/api";
import { couponSchema, type CouponFormValues } from "@/features/promotions/schema";
import type { Coupon } from "@/features/promotions/types";

type CouponResult = { ok: true; coupon: Coupon } | { ok: false; message: string };

export async function checkCouponAction(values: CouponFormValues): Promise<CouponResult> {
  const parsed = couponSchema.safeParse(values);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };

  const result = await checkCoupon(parsed.data.code);
  return result.valid
    ? { ok: true, coupon: result.coupon }
    : { ok: false, message: result.message };
}
