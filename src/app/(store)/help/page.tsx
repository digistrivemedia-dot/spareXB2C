import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = { title: "Help centre" };

export default function HelpPage() {
  return <ComingSoon title="The help centre" />;
}
