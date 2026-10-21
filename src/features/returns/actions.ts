"use server";

import { getSession } from "@/features/auth/session";
import { getOrder } from "@/features/orders/api";
import { canReturn, getReturnableQuantities } from "@/features/orders/utils";
import { requestReturn } from "@/features/returns/api";
import { returnRequestSchema, type ReturnRequestValues } from "@/features/returns/schema";
import { reasonsNeedingPhotos } from "@/features/returns/utils";
import { toIndianIsoDate } from "@/lib/format";
import type { Photo } from "@/lib/types";

type RequestReturnResult = { ok: true; returnId: string } | { ok: false; message: string };

export async function requestReturnAction(
  orderId: string,
  values: ReturnRequestValues,
  photos: Photo[],
): Promise<RequestReturnResult> {
  if (!(await getSession())) return { ok: false, message: "Please log in again to continue." };
  const parsed = returnRequestSchema.safeParse(values);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  const { quantities, reason, details } = parsed.data;
  if (reasonsNeedingPhotos.includes(reason) && photos.length === 0) {
    return { ok: false, message: "Add a photo of the part, so we can check it before the pickup." };
  }

  const order = await getOrder(orderId);
  if (!order || !canReturn(order, toIndianIsoDate(new Date()))) {
    return { ok: false, message: "This order can't be returned any more. Please contact us." };
  }
  const returnable = getReturnableQuantities(order);
  const items = Object.entries(quantities)
    .filter(([, quantity]) => quantity > 0)
    .map(([orderItemId, quantity]) => ({ orderItemId, quantity }));
  if (items.some(({ orderItemId, quantity }) => quantity > (returnable[orderItemId] ?? 0))) {
    return {
      ok: false,
      message: "Some of these parts are already being returned. Please refresh.",
    };
  }

  const request = await requestReturn({ orderId, items, reason, details, photos });
  return { ok: true, returnId: request.id };
}
