import { Package } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";

/** Shown when an order link is wrong or belongs to someone else. */
export function OrderNotFound() {
  return (
    <EmptyState
      icon={Package}
      titleAs="h1"
      title="We couldn't find this order"
      description="It may belong to another account. Your orders are all listed on the orders page."
    >
      <Button asChild>
        <Link href="/account/orders">Go to my orders</Link>
      </Button>
    </EmptyState>
  );
}
