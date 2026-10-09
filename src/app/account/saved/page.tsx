import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = { title: "Saved items" };

export default function SavedPage() {
  return <ComingSoon title="Your wishlist" />;
}
