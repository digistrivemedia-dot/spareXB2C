import Link from "next/link";

import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";

/** Phones: the total and checkout stay in reach while scrolling. */
export function MobileCheckoutBar({ totalInPaise }: { totalInPaise: number }) {
  return (
    <MobileActionBar>
      <p className="leading-tight">
        <span className="block text-xs text-gray-500">Total</span>
        <span className="text-lg font-semibold text-gray-900 tabular-nums">
          {formatPrice(totalInPaise)}
        </span>
      </p>
      <Button asChild>
        <Link href="/checkout">Proceed to checkout</Link>
      </Button>
    </MobileActionBar>
  );
}
