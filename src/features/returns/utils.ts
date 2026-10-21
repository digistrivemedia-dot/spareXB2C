import type { StatusTone } from "@/components/ui/StatusBadge";
import type { Step } from "@/components/ui/Stepper";
import type { ReturnRequest, ReturnStatus } from "@/features/returns/types";
import { formatDateTime } from "@/lib/format";

export const returnStatusLabel: Record<ReturnStatus, string> = {
  requested: "Return requested",
  approved: "Return approved",
  rejected: "Return not approved",
  "picked-up": "Picked up",
  refunded: "Refunded",
};

export const returnStatusTone: Record<ReturnStatus, StatusTone> = {
  requested: "warning",
  approved: "info",
  rejected: "danger",
  "picked-up": "info",
  refunded: "success",
};

export const returnReasons = [
  "The part doesn't fit my vehicle",
  "Received a damaged part",
  "Received the wrong part",
  "Part is missing from the box",
  "Other",
];

/** For these, a photo is the only way the team can check before the pickup. */
export const reasonsNeedingPhotos = ["Received a damaged part", "Received the wrong part"];

const flow: { status: ReturnStatus; label: string }[] = [
  { status: "requested", label: "Requested" },
  { status: "approved", label: "Approved" },
  { status: "picked-up", label: "Picked up" },
  { status: "refunded", label: "Refunded" },
];

/** The return's timeline. A rejected return stops after "Requested" with "Not approved". */
export function getReturnProgress(request: ReturnRequest): { steps: Step[]; activeStep: number } {
  const reachedAt = (status: ReturnStatus) =>
    request.history.findLast((event) => event.status === status)?.at;
  const toStep = ({ status, label }: { status: ReturnStatus; label: string }) => {
    const at = reachedAt(status);
    return { label, detail: at ? formatDateTime(at) : undefined };
  };

  if (request.status === "rejected") {
    const steps = [flow[0], { status: "rejected" as const, label: "Not approved" }].map(toStep);
    return { steps, activeStep: steps.length };
  }
  const reached = flow.findIndex((step) => step.status === request.status);
  return {
    steps: flow.map(toStep),
    activeStep: request.status === "refunded" ? flow.length : reached + 1,
  };
}

/** What the customer gets back: the price paid for each unit returned. */
export function getRefundAmount(items: { quantity: number; unitPriceInPaise: number }[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPriceInPaise, 0);
}
