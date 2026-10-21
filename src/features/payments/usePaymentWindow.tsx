"use client";

import { useState } from "react";

import { DemoPaymentWindow } from "@/features/payments/components/DemoPaymentWindow";
import { RazorpayWindow } from "@/features/payments/components/RazorpayWindow";
import type { PaymentResult, PaymentSession } from "@/features/payments/types";
import { dataSource } from "@/lib/config";

const PaymentWindow = dataSource.payments === "mock" ? DemoPaymentWindow : RazorpayWindow;

/**
 * Opens the payment window for a session and resolves with how it ended. What happens next
 * (confirming, going to a page) is up to the caller. Render `paymentWindow` on the page.
 */
export function usePaymentWindow() {
  const [open, setOpen] = useState<{
    session: PaymentSession;
    resolve: (result: PaymentResult) => void;
  } | null>(null);

  function pay(session: PaymentSession): Promise<PaymentResult> {
    return new Promise((resolve) => setOpen({ session, resolve }));
  }

  const paymentWindow = open ? (
    <PaymentWindow
      session={open.session}
      onResult={(result) => {
        setOpen(null);
        open.resolve(result);
      }}
    />
  ) : null;

  return { pay, paymentWindow };
}
