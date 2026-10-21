"use client";

import { LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useOrderPayment } from "@/features/payments/useOrderPayment";
import { formatPrice } from "@/lib/format";

type RetryPaymentButtonProps = {
  orderId: string;
  amountInPaise: number;
};

export function RetryPaymentButton({ orderId, amountInPaise }: RetryPaymentButtonProps) {
  const { pay, isBusy, paymentWindow } = useOrderPayment();

  return (
    <>
      <Button size="lg" onClick={() => pay(orderId)} disabled={isBusy}>
        <LockKeyhole aria-hidden />
        {isBusy ? "Opening payment…" : `Pay ${formatPrice(amountInPaise)}`}
      </Button>
      {paymentWindow}
    </>
  );
}
