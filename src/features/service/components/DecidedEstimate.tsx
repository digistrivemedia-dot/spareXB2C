import { Check, X } from "lucide-react";

import { Card } from "@/components/ui/Card";
import type { Estimate } from "@/features/service/types";
import { estimateLineKindLabel, getEstimateTotal } from "@/features/service/utils";
import { formatDateTime, formatPrice } from "@/lib/format";

/** An answered estimate: what was approved (done) and declined (not done). */
export function DecidedEstimate({ estimate }: { estimate: Estimate }) {
  return (
    <Card
      aria-label={estimate.kind === "booked-work" ? "Booked work" : "Extra work"}
      className="grid gap-4"
    >
      <div className="grid gap-1">
        <h2 className="text-lg font-semibold text-gray-900">
          {estimate.kind === "booked-work" ? "Booked work" : "Extra work"}
        </h2>
        <p className="text-sm text-gray-700">{estimate.note}</p>
        {estimate.decidedAt && (
          <p className="text-xs text-gray-500">Answered {formatDateTime(estimate.decidedAt)}</p>
        )}
      </div>
      <ul className="grid gap-2 text-sm">
        {estimate.lines.map((line) => {
          const isApproved = line.decision === "approved";
          return (
            <li key={line.id} className="flex items-baseline gap-3">
              {isApproved ? (
                <Check className="size-4 shrink-0 text-success-700" aria-label="Approved" />
              ) : (
                <X className="size-4 shrink-0 text-gray-400" aria-label="Declined" />
              )}
              <span
                className={
                  isApproved ? "flex-1 text-gray-900" : "flex-1 text-gray-500 line-through"
                }
              >
                {line.description}{" "}
                <span className="no-underline">· {estimateLineKindLabel[line.kind]}</span>
              </span>
              <span className="tabular-nums">{formatPrice(line.amountInPaise)}</span>
            </li>
          );
        })}
      </ul>
      <p className="flex justify-between border-t border-gray-200 pt-3 text-sm font-semibold text-gray-900">
        <span>Approved</span>
        <span className="tabular-nums">{formatPrice(getEstimateTotal(estimate, "approved"))}</span>
      </p>
    </Card>
  );
}
