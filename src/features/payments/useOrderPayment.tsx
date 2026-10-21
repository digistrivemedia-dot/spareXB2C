"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import {
  confirmPaymentAction,
  paymentFailedAction,
  startPaymentAction,
} from "@/features/payments/actions";
import { usePaymentWindow } from "@/features/payments/usePaymentWindow";

/**
 * Pays for an order online: opens the payment window, then goes to the order confirmation, or to
 * the payment page (with the reason) when it fails or the customer closes it.
 * Render `paymentWindow` somewhere on the page.
 */
export function useOrderPayment() {
  const router = useRouter();
  const { pay: openWindow, paymentWindow } = usePaymentWindow();
  const [isBusy, setIsBusy] = useState(false);

  async function pay(orderId: string) {
    setIsBusy(true);
    const started = await startPaymentAction(orderId);
    if (!started.ok) {
      toast.error(started.message);
      setIsBusy(false);
      return;
    }

    const result = await openWindow(started.session);
    if (result.status === "paid") {
      const confirmed = await confirmPaymentAction(orderId, result.proof);
      if (confirmed.ok) {
        router.replace(`/checkout/success?order=${orderId}`);
        return;
      }
      toast.error(confirmed.message);
    } else {
      const reason =
        result.status === "failed" ? result.reason : "You closed the payment window before paying.";
      await paymentFailedAction(orderId, reason);
    }
    setIsBusy(false);
    router.replace(`/checkout/payment?order=${orderId}`);
  }

  return { pay, isBusy, paymentWindow };
}
