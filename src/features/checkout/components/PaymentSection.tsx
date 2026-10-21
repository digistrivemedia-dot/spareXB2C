import { Banknote, LockKeyhole, type LucideIcon } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

import { FieldError } from "@/components/ui/field";
import { RadioCard } from "@/components/ui/RadioCard";
import { RadioGroup } from "@/components/ui/radio-group";
import type { CheckoutValues } from "@/features/checkout/schema";
import type { PaymentMode } from "@/features/orders/types";
import { features } from "@/lib/config";

const modes: { mode: PaymentMode; icon: LucideIcon; title: string; note: string }[] = [
  {
    mode: "online",
    icon: LockKeyhole,
    title: "Pay online",
    note: "UPI, credit and debit cards, net banking and wallets, on Razorpay's secure page.",
  },
  {
    mode: "cod",
    icon: Banknote,
    title: "Cash on delivery",
    note: "Pay in cash or UPI when the parts arrive.",
  },
];

/** Step 3: how to pay. Online payment opens Razorpay after "Place order". */
export function PaymentSection() {
  const { control } = useFormContext<CheckoutValues>();
  const [online] = modes;

  // Without cash on delivery there is nothing to choose, so this just says how payment works.
  if (!features.cashOnDelivery) {
    return (
      <div className="flex gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm">
        <online.icon className="mt-0.5 size-5 shrink-0 text-navy-700" aria-hidden />
        <div>
          <p className="font-semibold text-gray-900">{online.title}</p>
          <p className="text-gray-600">{online.note}</p>
        </div>
      </div>
    );
  }

  return (
    <Controller
      name="paymentMode"
      control={control}
      render={({ field, fieldState }) => (
        <div className="grid gap-2">
          <RadioGroup
            value={field.value ?? ""}
            onValueChange={field.onChange}
            aria-label="How you'll pay"
            className="gap-3"
          >
            {modes.map(({ mode, icon: Icon, title, note }) => (
              <RadioCard key={mode} value={mode} id={`pay-${mode}`}>
                <span className="flex items-center gap-2 font-semibold text-gray-900">
                  <Icon className="size-5 text-navy-700" aria-hidden />
                  {title}
                </span>
                <span className="mt-0.5 block text-gray-500">{note}</span>
              </RadioCard>
            ))}
          </RadioGroup>
          <FieldError errors={[fieldState.error]} />
        </div>
      )}
    />
  );
}
