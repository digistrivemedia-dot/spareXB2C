import { CalendarPlus, Phone, ShoppingBag } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ShopForBikeLink } from "@/features/vehicles/components/ShopForBikeLink";
import type { MyBike } from "@/features/vehicles/types";
import { BREAKDOWN_PHONE } from "@/lib/constants";
import { formatMobile } from "@/lib/format";

// Same height for all three; labels may wrap in the narrow three-column layout on tablets.
const actionSize = "h-full min-h-14 px-4 py-2 whitespace-normal";

export function QuickActions({ bike }: { bike: MyBike }) {
  return (
    <nav aria-label="Quick actions" className="grid gap-3 sm:grid-cols-3">
      <Button asChild size="lg" className={actionSize}>
        <Link href="/services/book">
          <CalendarPlus aria-hidden />
          Book a service
        </Link>
      </Button>
      <Button asChild size="lg" variant="secondary" className={actionSize}>
        <ShopForBikeLink bike={bike}>
          <ShoppingBag aria-hidden />
          Shop parts for this bike
        </ShopForBikeLink>
      </Button>
      <Button asChild size="lg" variant="destructive" className={actionSize}>
        <a href={`tel:+91${BREAKDOWN_PHONE}`}>
          <Phone aria-hidden />
          <span className="flex flex-col items-start leading-tight">
            Breakdown help
            <span className="text-xs font-normal tabular-nums">
              {formatMobile(BREAKDOWN_PHONE)}
            </span>
          </span>
        </a>
      </Button>
    </nav>
  );
}
