import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = { title: "Help" };

export default function AccountHelpPage() {
  return <ComingSoon title="Account help" />;
}
