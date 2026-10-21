"use client";

import { useEffect, useEffectEvent } from "react";

import type { PaymentResult, PaymentSession } from "@/features/payments/types";
import { SITE_NAME } from "@/lib/constants";

const CHECKOUT_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

// The parts of Razorpay's Checkout script this page uses.
type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};
type RazorpayInstance = {
  open: () => void;
  on: (event: "payment.failed", handler: (r: { error: { description: string } }) => void) => void;
};
declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

function loadCheckoutScript(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = CHECKOUT_SCRIPT;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Razorpay didn't load"));
    document.body.append(script);
  });
}

type RazorpayWindowProps = {
  session: PaymentSession;
  onResult: (result: PaymentResult) => void;
};

/** Opens Razorpay's own payment window for the session, and reports how it ended. Renders nothing. */
export function RazorpayWindow({ session, onResult }: RazorpayWindowProps) {
  const report = useEffectEvent(onResult);

  // Opens once per session; a new session (a retry) opens a new window.
  useEffect(() => {
    loadCheckoutScript().then(
      () => {
        if (!window.Razorpay) return;
        const checkout = new window.Razorpay({
          key: session.keyId,
          order_id: session.gatewayOrderId,
          amount: session.amountInPaise,
          currency: "INR",
          name: SITE_NAME,
          description: session.description,
          prefill: {
            name: session.customer.name,
            contact: `+91${session.customer.mobile}`,
            email: session.customer.email ?? undefined,
          },
          handler: (response: RazorpayResponse) =>
            report({
              status: "paid",
              proof: {
                gatewayOrderId: response.razorpay_order_id,
                gatewayPaymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              },
            }),
          modal: { ondismiss: () => report({ status: "closed" }) },
        });
        checkout.on("payment.failed", ({ error }) =>
          report({ status: "failed", reason: error.description }),
        );
        checkout.open();
      },
      () =>
        report({
          status: "failed",
          reason: "The payment page didn't load. Check your connection.",
        }),
    );
  }, [session]);

  return null;
}
