import { SearchX } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ProductNotFound() {
  return (
    <EmptyState
      icon={SearchX}
      titleAs="h1"
      title="We couldn't find this part"
      description="It may have been renamed or is no longer sold. Search by name or part number to find it."
    >
      <Button asChild>
        <Link href="/products">Browse all parts</Link>
      </Button>
    </EmptyState>
  );
}
