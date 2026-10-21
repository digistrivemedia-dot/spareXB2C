"use server";

import { refresh } from "next/cache";

import { getSession } from "@/features/auth/session";
import { cancelOrder, getOrder } from "@/features/orders/api";
import { orderChangeSchema, type OrderChangeValues } from "@/features/orders/schema";
import { canCancel } from "@/features/orders/utils";
import type { ActionResult } from "@/lib/types";

function describe({ reason, details }: OrderChangeValues): string {
  return details ? `${reason}: ${details}` : reason;
}

export async function cancelOrderAction(
  orderId: string,
  values: OrderChangeValues,
): Promise<ActionResult> {
  const parsed = orderChangeSchema.safeParse(values);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };

  const order = (await getSession()) ? await getOrder(orderId) : null;
  if (!order || !canCancel(order)) {
    return {
      ok: false,
      message: "This order can't be cancelled any more. Please contact us for help.",
    };
  }
  await cancelOrder(orderId, describe(parsed.data));
  refresh();
  return { ok: true };
}
