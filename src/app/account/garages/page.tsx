import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = { title: "Garages" };

export default function GaragesPage() {
  return <ComingSoon title="Finding a garage" />;
}
