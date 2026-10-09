import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = { title: "Shipping" };

export default function ShippingPolicyPage() {
  return <ComingSoon title="Our shipping policy" />;
}
