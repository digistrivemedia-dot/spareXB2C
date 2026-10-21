import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { OrderReturnSummary } from "@/features/orders/types";
import { returnStatusLabel, returnStatusTone } from "@/features/returns/utils";
import { formatDate } from "@/lib/format";

/** The returns asked for on an order, each linking to its status page. */
export function OrderReturnsCard({ returns }: { returns: OrderReturnSummary[] }) {
  if (returns.length === 0) return null;

  return (
    <Card aria-labelledby="order-returns-heading">
      <SectionHeader id="order-returns-heading" title="Returns" />
      <ul className="divide-y divide-gray-200">
        {returns.map((request) => {
          const units = request.items.reduce((sum, item) => sum + item.quantity, 0);
          return (
            <li key={request.id}>
              <Link
                href={`/account/returns/${request.id}`}
                className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3 text-sm outline-none first:pt-0 last:pb-0 hover:text-navy-700 focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <span className="font-semibold text-gray-900">{request.number}</span>
                <StatusBadge tone={returnStatusTone[request.status]}>
                  {returnStatusLabel[request.status]}
                </StatusBadge>
                <span className="flex-1 text-gray-600">
                  {units} {units === 1 ? "part" : "parts"} · Asked on{" "}
                  {formatDate(request.createdAt)}
                </span>
                <span className="inline-flex items-center gap-0.5 font-semibold text-navy-700">
                  View return
                  <ChevronRight className="size-4" aria-hidden />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
