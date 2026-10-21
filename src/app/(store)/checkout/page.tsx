import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { getAddresses } from "@/features/account/api";
import { getSession } from "@/features/auth/session";
import { CheckoutView } from "@/features/checkout/components/CheckoutView";
import { getMyVehicles } from "@/features/vehicles/api";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Choose a delivery address and payment method, and place your order.",
};

export default async function CheckoutPage() {
  // Orders belong to an account, so checkout asks guests to log in first.
  const session = await getSession();
  if (!session) redirect("/login?next=/checkout");
  const [addresses, vehicles] = await Promise.all([getAddresses(), getMyVehicles()]);

  return (
    <Container className="grid grid-cols-1 gap-6 py-6 lg:py-8">
      <h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">Checkout</h1>
      <CheckoutView addresses={addresses} vehicles={vehicles} savedGstin={session.user.gstin} />
    </Container>
  );
}
