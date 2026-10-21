"use server";

import { refresh } from "next/cache";

import { getSession } from "@/features/auth/session";
import { getOrder } from "@/features/orders/api";
import { confirmPayment, reportPaymentFailure, startPayment } from "@/features/payments/api";
import type { PaymentProof, PaymentSession } from "@/features/payments/types";
import type { ActionResult } from "@/lib/types";

const LOGGED_OUT = { ok: false, message: "Please log in again to continue." } as const;

export async function startPaymentAction(
  orderId: string,
): Promise<{ ok: true; session: PaymentSession } | { ok: false; message: string }> {
  if (!(await getSession())) return LOGGED_OUT;
  const order = await getOrder(orderId);
  if (!order) return { ok: false, message: "We couldn't find this order." };
  if (order.payment.status === "paid") return { ok: false, message: "This order is already paid." };
  if (order.status === "cancelled") return { ok: false, message: "This order was cancelled." };

  const session = await startPayment(orderId);
  return session
    ? { ok: true, session }
    : { ok: false, message: "We couldn't start the payment. Please try again." };
}

export async function confirmPaymentAction(
  orderId: string,
  proof: PaymentProof,
): Promise<ActionResult> {
  if (!(await getSession())) return LOGGED_OUT;
  const order = await confirmPayment(orderId, proof);
  return order
    ? { ok: true }
    : { ok: false, message: "We couldn't confirm your payment. If money was taken, call us." };
}

export async function paymentFailedAction(orderId: string, reason: string): Promise<void> {
  if (!(await getSession())) return;
  await reportPaymentFailure(orderId, reason);
  refresh();
}
