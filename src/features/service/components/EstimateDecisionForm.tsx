"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/checkbox";
import { decideEstimateAction } from "@/features/service/actions";
import type { Estimate } from "@/features/service/types";
import { estimateLineKindLabel } from "@/features/service/utils";
import { formatPrice } from "@/lib/format";

type EstimateDecisionFormProps = {
  jobId: string;
  estimate: Estimate;
};

/** A tick per item of work (all ticked to start), "Approve all", and the total of what's ticked. */
export function EstimateDecisionForm({ jobId, estimate }: EstimateDecisionFormProps) {
  const router = useRouter();
  const [approved, setApproved] = useState<string[]>(estimate.lines.map((line) => line.id));
  const [isSending, startTransition] = useTransition();
  const total = estimate.lines
    .filter((line) => approved.includes(line.id))
    .reduce((sum, line) => sum + line.amountInPaise, 0);
  const allApproved = approved.length === estimate.lines.length;
  const sendLabel =
    approved.length === 0
      ? "Decline all"
      : allApproved
        ? "Approve all"
        : `Approve ${approved.length} of ${estimate.lines.length}`;

  function toggle(lineId: string, isOn: boolean) {
    setApproved(isOn ? [...approved, lineId] : approved.filter((id) => id !== lineId));
  }

  function send() {
    startTransition(async () => {
      const result = await decideEstimateAction(jobId, estimate.id, approved);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success(
        approved.length > 0
          ? "Sent to the garage. Work goes ahead."
          : "Sent. The extra work won't be done.",
      );
      router.push(`/account/services/${jobId}`);
    });
  }

  return (
    <Card aria-labelledby="estimate-heading" className="grid gap-5">
      <div className="grid gap-1">
        <h2 id="estimate-heading" className="text-lg font-semibold text-gray-900 md:text-xl">
          Extra work found
        </h2>
        <p className="text-sm text-gray-700">{estimate.note}</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-3">
        <p className="text-sm text-gray-600">Untick anything you don&apos;t want done.</p>
        <Button
          variant="link"
          size="sm"
          onClick={() => setApproved(allApproved ? [] : estimate.lines.map((line) => line.id))}
        >
          {allApproved ? "Untick all" : "Approve all"}
        </Button>
      </div>

      <ul className="grid gap-1">
        {estimate.lines.map((line) => {
          const id = `estimate-line-${line.id}`;
          return (
            <li key={line.id} className="flex min-h-11 items-center gap-3">
              <Checkbox
                id={id}
                checked={approved.includes(line.id)}
                onCheckedChange={(state) => toggle(line.id, state === true)}
              />
              <label
                htmlFor={id}
                className="flex flex-1 cursor-pointer flex-wrap items-baseline gap-x-3 text-sm"
              >
                <span className="flex-1 text-gray-900">
                  {line.description}{" "}
                  <span className="text-gray-500">· {estimateLineKindLabel[line.kind]}</span>
                </span>
                <span className="font-semibold text-gray-900 tabular-nums">
                  {formatPrice(line.amountInPaise)}
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-700">
          Approved:{" "}
          <span className="text-lg font-semibold text-gray-900 tabular-nums">
            {formatPrice(total)}
          </span>
          <span className="block text-xs text-gray-500">Including GST. Added to your bill.</span>
        </p>
        <Button size="lg" onClick={send} disabled={isSending}>
          {isSending ? "Sending…" : sendLabel}
        </Button>
      </div>
    </Card>
  );
}
