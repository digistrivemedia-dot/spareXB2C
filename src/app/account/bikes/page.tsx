import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = { title: "My bikes" };

export default function MyBikesPage() {
  return <ComingSoon title="Managing your bikes" />;
}
