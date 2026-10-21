import { ClipboardCheck } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { Estimate } from "@/features/service/types";
import { getEstimateTotal } from "@/features/service/utils";
import { formatPrice } from "@/lib/format";

type EstimateBannerProps = {
  jobId: string;
  vehicleName: string;
  estimate: Estimate;
};

/** Top-of-page call to action when the garage is waiting for the customer's approval. */
export function EstimateBanner({ jobId, vehicleName, estimate }: EstimateBannerProps) {
  return (
    <div
      role="status"
      className="flex flex-col gap-4 rounded-xl border border-orange-100 bg-orange-50 p-4 sm:flex-row sm:items-center sm:justify-between md:p-5"
    >
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-orange-700 text-white">
          <ClipboardCheck className="size-5" aria-hidden />
        </span>
        <div>
          <p className="font-semibold text-gray-900">Estimate ready for your {vehicleName}</p>
          <p className="text-sm text-gray-700">
            The garage needs your go-ahead for extra work ·{" "}
            <span className="font-semibold tabular-nums">
              {formatPrice(getEstimateTotal(estimate))}
            </span>
          </p>
        </div>
      </div>
      <Button asChild className="sm:shrink-0">
        <Link href={`/account/services/${jobId}/estimate`}>Review & approve</Link>
      </Button>
    </div>
  );
}
