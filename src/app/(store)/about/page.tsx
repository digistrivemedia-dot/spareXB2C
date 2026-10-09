import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = { title: "About us" };

export default function AboutPage() {
  return <ComingSoon title="About Kannali Garage" />;
}
