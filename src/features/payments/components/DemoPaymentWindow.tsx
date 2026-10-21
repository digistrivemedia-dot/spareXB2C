"use client";

import { CreditCard, Landmark, type LucideIcon, Smartphone, Wallet } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioCard } from "@/components/ui/RadioCard";
import { RadioGroup } from "@/components/ui/radio-group";
import type { PaymentMethod } from "@/features/orders/types";
import { paymentMethodLabel } from "@/features/orders/utils";
import type { PaymentResult, PaymentSession } from "@/features/payments/types";
import { formatPrice } from "@/lib/format";

const methods: { method: PaymentMethod; icon: LucideIcon }[] = [
  { method: "upi", icon: Smartphone },
  { method: "card", icon: CreditCard },
  { method: "netbanking", icon: Landmark },
  { method: "wallet", icon: Wallet },
];

type DemoPaymentWindowProps = {
  session: PaymentSession;
  onResult: (result: PaymentResult) => void;
};

/**
 * Stands in for Razorpay's payment window in the demo: the customer picks a method and the
 * payment succeeds, or they make it fail to see the retry page. No money moves.
 */
export function DemoPaymentWindow({ session, onResult }: DemoPaymentWindowProps) {
  const [method, setMethod] = useState<PaymentMethod>("upi");

  function pay() {
    onResult({
      status: "paid",
      proof: {
        gatewayOrderId: session.gatewayOrderId,
        gatewayPaymentId: `pay_demo_${Date.now()}`,
        signature: "demo",
        demoMethod: method,
      },
    });
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onResult({ status: "closed" })}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pay {formatPrice(session.amountInPaise)}</DialogTitle>
          <DialogDescription>
            {session.description} · Demo payment: no money is taken. The live site opens Razorpay
            here.
          </DialogDescription>
        </DialogHeader>
        <RadioGroup
          value={method}
          onValueChange={(value) =>
            setMethod(methods.find((m) => m.method === value)?.method ?? "upi")
          }
          aria-label="Payment method"
          className="gap-2"
        >
          {methods.map(({ method: value, icon: Icon }) => (
            <RadioCard key={value} value={value} id={`demo-pay-${value}`}>
              <span className="flex items-center gap-2 font-semibold text-gray-900">
                <Icon className="size-5 text-navy-700" aria-hidden />
                {paymentMethodLabel[value]}
              </span>
            </RadioCard>
          ))}
        </RadioGroup>
        <DialogFooter className="sm:justify-between">
          <Button
            variant="ghost"
            onClick={() =>
              onResult({ status: "failed", reason: "Your bank declined the payment." })
            }
          >
            Make it fail (demo)
          </Button>
          <Button onClick={pay}>Pay {formatPrice(session.amountInPaise)}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
