import { Banknote, CreditCard, Landmark, type LucideIcon, Smartphone, Wallet } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

import { FieldError } from "@/components/ui/field";
import { RadioCard } from "@/components/ui/RadioCard";
import { RadioGroup } from "@/components/ui/radio-group";
import type { CheckoutValues } from "@/features/checkout/schema";
import type { PaymentMethod } from "@/features/orders/types";
import { paymentMethodLabel } from "@/features/orders/utils";

const options: { method: PaymentMethod; icon: LucideIcon; note: string }[] = [
  { method: "upi", icon: Smartphone, note: "Google Pay, PhonePe, Paytm or any UPI app" },
  { method: "card", icon: CreditCard, note: "Visa, Mastercard and RuPay" },
  { method: "netbanking", icon: Landmark, note: "All major Indian banks" },
  { method: "wallet", icon: Wallet, note: "Paytm, Amazon Pay and more" },
  { method: "cod", icon: Banknote, note: "Pay in cash or UPI when the parts arrive" },
];

/** Step 3: how to pay. A demo: no payment gateway is connected yet. */
export function PaymentSection() {
  const { control } = useFormContext<CheckoutValues>();

  return (
    <Controller
      name="paymentMethod"
      control={control}
      render={({ field, fieldState }) => (
        <div className="grid gap-2">
          <RadioGroup
            value={field.value ?? ""}
            onValueChange={field.onChange}
            aria-label="Payment method"
            className="gap-3"
          >
            {options.map(({ method, icon: Icon, note }) => (
              <RadioCard key={method} value={method} id={`pay-${method}`}>
                <span className="flex items-center gap-2 font-semibold text-gray-900">
                  <Icon className="size-5 text-navy-700" aria-hidden />
                  {paymentMethodLabel[method]}
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
