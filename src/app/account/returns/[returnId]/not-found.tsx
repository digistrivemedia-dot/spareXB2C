import { RotateCcw } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ReturnNotFound() {
  return (
    <EmptyState
      icon={RotateCcw}
      titleAs="h1"
      title="We couldn't find this return"
      description="Returns are listed on the order they belong to."
    >
      <Button asChild>
        <Link href="/account/orders">Go to my orders</Link>
      </Button>
    </EmptyState>
  );
}
