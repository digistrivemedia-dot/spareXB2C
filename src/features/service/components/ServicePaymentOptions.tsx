"use client";

import { LockKeyhole, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { usePaymentWindow } from "@/features/payments/usePaymentWindow";
import {
  confirmServicePaymentAction,
  payAtGarageAction,
  startServicePaymentAction,
} from "@/features/service/actions";
import type { ServiceBill } from "@/features/service/types";
import { formatPrice } from "@/lib/format";

type ServicePaymentOptionsProps = {
  jobId: string;
  bill: ServiceBill;
};

/** Pay the garage's bill online now, or say you'll pay at the counter when you collect. */
export function ServicePaymentOptions({ jobId, bill }: ServicePaymentOptionsProps) {
  const router = useRouter();
  const { pay, paymentWindow } = usePaymentWindow();
  const [isBusy, setIsBusy] = useState(false);
  const [isChoosing, startChoosing] = useTransition();
  const willPayAtGarage = bill.payment.method === "at-garage";

  async function payOnline() {
    setIsBusy(true);
    const started = await startServicePaymentAction(jobId);
    if (!started.ok) {
      toast.error(started.message);
      setIsBusy(false);
      return;
    }
    const result = await pay(started.session);
    if (result.status === "paid") {
      const confirmed = await confirmServicePaymentAction(jobId, result.proof);
      if (confirmed.ok) {
        toast.success("Paid. Thank you!", {
          description: "Show this to the garage when you collect.",
        });
        router.push(`/account/services/${jobId}`);
        return;
      }
      toast.error(confirmed.message);
    } else if (result.status === "failed") {
      toast.error("The payment didn't go through", { description: result.reason });
    }
    setIsBusy(false);
  }

  function payAtGarage() {
    startChoosing(async () => {
      const result = await payAtGarageAction(jobId);
      if (result.ok) toast.success("Noted. Pay at the counter when you collect.");
      else toast.error(result.message);
    });
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Button size="lg" onClick={payOnline} disabled={isBusy}>
        <LockKeyhole aria-hidden />
        {isBusy ? "Opening payment…" : `Pay ${formatPrice(bill.totalInPaise)} online`}
      </Button>
      {willPayAtGarage ? (
        <p className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 text-sm text-gray-700">
          <Store className="size-4 shrink-0 text-navy-700" aria-hidden />
          You chose to pay at the garage.
        </p>
      ) : (
        <Button size="lg" variant="secondary" onClick={payAtGarage} disabled={isChoosing}>
          <Store aria-hidden />
          I&apos;ll pay at the garage
        </Button>
      )}
      {paymentWindow}
    </div>
  );
}
