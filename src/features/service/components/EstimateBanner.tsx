"use client";

import { ClipboardCheck } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { EstimateDialog } from "@/features/service/components/EstimateDialog";
import type { Estimate } from "@/features/service/types";
import { formatPrice } from "@/lib/format";

type EstimateBannerProps = {
  jobId: string;
  bikeName: string;
  estimate: Estimate;
};

/** Top-of-page call to action when the garage is waiting for the customer's approval. */
export function EstimateBanner({ jobId, bikeName, estimate }: EstimateBannerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        role="status"
        className="flex flex-col gap-4 rounded-xl border border-orange-100 bg-orange-50 p-4 sm:flex-row sm:items-center sm:justify-between md:p-5"
      >
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-orange-700 text-white">
            <ClipboardCheck className="size-5" aria-hidden />
          </span>
          <div>
            <p className="font-semibold text-gray-900">Estimate ready for your {bikeName}</p>
            <p className="text-sm text-gray-700">
              The garage needs your go-ahead for extra work ·{" "}
              <span className="font-semibold tabular-nums">
                {formatPrice(estimate.totalInPaise)}
              </span>
            </p>
          </div>
        </div>
        <Button onClick={() => setOpen(true)} className="sm:shrink-0">
          Review & approve
        </Button>
      </div>
      <EstimateDialog
        jobId={jobId}
        bikeName={bikeName}
        estimate={estimate}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
