"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { Button } from "@/components/ui/button";
import { emptyAddressFields } from "@/features/account/schema";
import type { Address } from "@/features/account/types";
import { selectCoupon, useCartStore } from "@/features/cart/store";
import { getCartTotals } from "@/features/cart/utils";
import { placeOrderAction } from "@/features/checkout/actions";
import { AddressSection } from "@/features/checkout/components/AddressSection";
import { CheckoutStep } from "@/features/checkout/components/CheckoutStep";
import { CheckoutSummary } from "@/features/checkout/components/CheckoutSummary";
import { PaymentSection } from "@/features/checkout/components/PaymentSection";
import { VehicleSection } from "@/features/checkout/components/VehicleSection";
import { useOrderPayment } from "@/features/payments/useOrderPayment";
import { type CheckoutValues, checkoutSchema } from "@/features/checkout/schema";
import { useVehicleStore } from "@/features/vehicles/store";
import type { MyVehicle } from "@/features/vehicles/types";
import { formatPrice } from "@/lib/format";

type CheckoutFormProps = {
  addresses: Address[];
  vehicles: MyVehicle[];
  /** From the customer's profile, filled in when they ask for a GST invoice. */
  savedGstin: string | null;
};

const FORM_ID = "checkout-form";

/** Mounted once the cart has loaded, so the defaults (like the shop's selected vehicle) are known. */
export function CheckoutForm({ addresses, vehicles, savedGstin }: CheckoutFormProps) {
  const router = useRouter();
  const [isPlacing, startTransition] = useTransition();
  const { pay, isBusy: isPaying, paymentWindow } = useOrderPayment();
  const items = useCartStore((state) => state.items);
  const coupon = useCartStore(selectCoupon);
  const selectedVehicle = useVehicleStore((state) => state.selectedVehicle);
  const totals = getCartTotals(items, coupon);

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      addressId: addresses.find((a) => a.isDefault)?.id ?? (addresses.length ? "" : "new"),
      address: emptyAddressFields,
      billingSameAsDelivery: true,
      billingAddressId: "",
      wantsGstInvoice: false,
      gstin: savedGstin ?? "",
      vehicleId: vehicles.find((b) => b.id === selectedVehicle?.myVehicleId)?.id ?? "",
      paymentMode: "online",
    },
  });

  function placeOrder(values: CheckoutValues) {
    const lines = items.map(({ productId, quantity }) => ({ productId, quantity }));
    startTransition(async () => {
      const result = await placeOrderAction(values, { lines, couponCode: coupon?.code ?? null });
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      if (values.paymentMode === "cod") router.replace(`/checkout/success?order=${result.orderId}`);
      else await pay(result.orderId);
    });
  }
  const isBusy = isPlacing || isPaying;

  return (
    <FormProvider {...form}>
      <form
        id={FORM_ID}
        onSubmit={form.handleSubmit(placeOrder, () =>
          toast.error("Please check the highlighted details."),
        )}
        noValidate
        className="grid grid-cols-1 gap-6 lg:grid-cols-12"
      >
        <div className="grid grid-cols-1 content-start gap-6 lg:col-span-8">
          <CheckoutStep number={1} title="Delivery address">
            <AddressSection addresses={addresses} />
          </CheckoutStep>
          <CheckoutStep number={2} title="Vehicle for this order" note="Optional">
            <VehicleSection vehicles={vehicles} />
          </CheckoutStep>
          <CheckoutStep number={3} title="Payment">
            <PaymentSection />
          </CheckoutStep>
        </div>
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-24">
            <CheckoutSummary items={items} totals={totals} formId={FORM_ID} isPlacing={isBusy} />
          </div>
        </div>
      </form>

      <MobileActionBar>
        <p className="leading-tight">
          <span className="block text-xs text-gray-500">Total</span>
          <span className="text-lg font-semibold text-gray-900 tabular-nums">
            {formatPrice(totals.totalInPaise)}
          </span>
        </p>
        <Button type="submit" form={FORM_ID} disabled={isBusy}>
          {isBusy ? "Placing…" : "Place order"}
        </Button>
      </MobileActionBar>
      {paymentWindow}
    </FormProvider>
  );
}
