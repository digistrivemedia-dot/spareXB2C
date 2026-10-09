import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = { title: "Terms of use" };

export default function TermsPage() {
  return <ComingSoon title="Our terms of use" />;
}
