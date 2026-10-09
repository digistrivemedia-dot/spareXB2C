import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = { title: "Services" };

export default function ServicesPage() {
  return <ComingSoon title="The services page" />;
}
