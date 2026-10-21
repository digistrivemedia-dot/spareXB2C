import type { Metadata } from "next";

import { PageNotFound } from "@/components/layout/PageNotFound";
import { SiteShell } from "@/components/layout/SiteShell";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <SiteShell>
      <PageNotFound />
    </SiteShell>
  );
}
