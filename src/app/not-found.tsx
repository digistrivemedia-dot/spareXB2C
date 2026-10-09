import { SearchX } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { SiteShell } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <SiteShell>
      <EmptyState
        icon={SearchX}
        titleAs="h1"
        title="We couldn't find that page"
        description="The link may be old or mistyped. Try searching for the part, or head back home."
      >
        <Button asChild>
          <Link href="/products">Shop parts</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/">Go to home</Link>
        </Button>
      </EmptyState>
    </SiteShell>
  );
}
