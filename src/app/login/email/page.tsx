import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = { title: "Log in with email" };

export default function EmailLoginPage() {
  return <ComingSoon title="Logging in with email" />;
}
