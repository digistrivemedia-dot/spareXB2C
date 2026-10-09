"use server";

import { getAddresses } from "@/features/account/api";
import type { Address } from "@/features/account/types";
import { getSession } from "@/features/auth/session";
import { type CheckoutValues, checkoutSchema } from "@/features/checkout/schema";
import { placeOrder } from "@/features/orders/api";
import type { OrderAddress, PlaceOrderInput } from "@/features/orders/types";

type PlaceOrderResult = { ok: true; orderId: string } | { ok: false; message: string };

function toOrderAddress({ id, isDefault, label, ...address }: Address): OrderAddress {
  return address;
}

export async function placeOrderAction(
  values: CheckoutValues,
  cart: Pick<PlaceOrderInput, "lines" | "couponCode">,
): Promise<PlaceOrderResult> {
  if (!(await getSession()))
    return { ok: false, message: "Please log in again to place your order." };
  if (cart.lines.length === 0) return { ok: false, message: "Your cart is empty." };

  const parsed = checkoutSchema.safeParse(values);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  const form = parsed.data;

  const saved = await getAddresses();
  const findSaved = (id: string): OrderAddress | undefined => {
    const address = saved.find((a) => a.id === id);
    return address && toOrderAddress(address);
  };

  const delivery = form.addressId === "new" ? form.newAddress : findSaved(form.addressId);
  if (!delivery) return { ok: false, message: "Please choose a delivery address again." };
  const billing = form.billingSameAsDelivery
    ? delivery
    : (findSaved(form.billingAddressId) ?? delivery);

  try {
    const order = await placeOrder({
      ...cart,
      deliveryAddress: delivery,
      billingAddress: billing,
      gstin: form.wantsGstInvoice ? form.gstin : null,
      bikeId: form.bikeId || null,
      paymentMethod: form.paymentMethod,
    });
    return { ok: true, orderId: order.id };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "We couldn't place your order. Please try again.",
    };
  }
}
