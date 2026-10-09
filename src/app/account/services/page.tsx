import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = { title: "My services" };

export default function MyServicesPage() {
  return <ComingSoon title="Service history" />;
}
