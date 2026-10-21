import { SearchX } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";

/** The "page not found" message, for use inside a layout that already has the header and footer. */
export function PageNotFound() {
  return (
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
  );
}
