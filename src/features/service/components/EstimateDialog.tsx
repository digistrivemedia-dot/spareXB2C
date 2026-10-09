import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { decideEstimateAction } from "@/features/service/actions";
import type { Estimate, EstimateLine } from "@/features/service/types";
import { formatPrice } from "@/lib/format";

type EstimateDialogProps = {
  jobId: string;
  bikeName: string;
  estimate: Estimate;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const groups: { kind: EstimateLine["kind"]; title: string }[] = [
  { kind: "labour", title: "Labour" },
  { kind: "parts", title: "Parts" },
  { kind: "consumables", title: "Consumables" },
];

export function EstimateDialog({
  jobId,
  bikeName,
  estimate,
  open,
  onOpenChange,
}: EstimateDialogProps) {
  const [isPending, startTransition] = useTransition();

  function decide(decision: "approved" | "declined") {
    startTransition(async () => {
      const result = await decideEstimateAction(jobId, decision);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      onOpenChange(false);
      toast.success(
        decision === "approved"
          ? "Estimate approved. The garage will start the work now."
          : "Estimate declined. The garage will finish only the booked service.",
      );
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-dvh overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Estimate for your {bikeName}</DialogTitle>
          <DialogDescription>{estimate.note}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          {groups.map(({ kind, title }) => {
            const lines = estimate.lines.filter((line) => line.kind === kind);
            if (lines.length === 0) return null;
            return (
              <section key={kind} aria-label={title}>
                <h3 className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  {title}
                </h3>
                <ul className="mt-2 grid gap-2">
                  {lines.map((line) => (
                    <li key={line.id} className="flex justify-between gap-4 text-sm text-gray-700">
                      <span>{line.description}</span>
                      <span className="font-semibold text-gray-900 tabular-nums">
                        {formatPrice(line.amountInPaise)}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
          <p className="flex justify-between border-t border-gray-200 pt-3 font-semibold text-gray-900">
            <span>Total (incl. GST)</span>
            <span className="tabular-nums">{formatPrice(estimate.totalInPaise)}</span>
          </p>
        </div>

        <DialogFooter>
          <Button variant="secondary" disabled={isPending} onClick={() => decide("declined")}>
            Decline extra work
          </Button>
          <Button disabled={isPending} onClick={() => decide("approved")}>
            Approve {formatPrice(estimate.totalInPaise)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
