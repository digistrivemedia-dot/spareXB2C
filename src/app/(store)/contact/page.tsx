import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = { title: "Contact us" };

export default function ContactPage() {
  return <ComingSoon title="The contact page" />;
}
