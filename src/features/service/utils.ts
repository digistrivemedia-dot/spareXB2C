import type { StatusTone } from "@/components/ui/StatusBadge";
import type { Step } from "@/components/ui/Stepper";
import type {
  Estimate,
  EstimateLine,
  EstimateLineKind,
  Garage,
  ReminderStatus,
  ServiceJob,
  ServiceStage,
  Weekday,
} from "@/features/service/types";
import { formatDateTime } from "@/lib/format";

export const serviceStageLabel: Record<ServiceStage, string> = {
  requested: "Waiting for the garage",
  booked: "Booked",
  inspected: "Inspected",
  "awaiting-approval": "Your approval needed",
  "in-service": "In service",
  ready: "Ready to collect",
  delivered: "Delivered",
  declined: "Declined by the garage",
  cancelled: "Cancelled",
};

export const serviceStageTone: Record<ServiceStage, StatusTone> = {
  requested: "warning",
  booked: "info",
  inspected: "info",
  "awaiting-approval": "warning",
  "in-service": "info",
  ready: "success",
  delivered: "success",
  declined: "danger",
  cancelled: "neutral",
};

// Once the work has started, the customer talks to the garage instead of cancelling in the app.
const cancellableStages: ServiceStage[] = ["requested", "booked", "inspected", "awaiting-approval"];

export function canCancelBooking(job: ServiceJob): boolean {
  return cancellableStages.includes(job.stage);
}

/** The estimate waiting for the customer's answer, if any. */
export function getPendingEstimate(job: ServiceJob): Estimate | null {
  return job.estimates.find((estimate) => estimate.decidedAt === null) ?? null;
}

/** An estimate's total, or the total of the lines matching `decision`. */
export function getEstimateTotal(estimate: Estimate, decision?: EstimateLine["decision"]): number {
  return estimate.lines
    .filter((line) => !decision || line.decision === decision)
    .reduce((sum, line) => sum + line.amountInPaise, 0);
}

export const estimateLineKindLabel: Record<EstimateLineKind, string> = {
  labour: "Labour",
  parts: "Parts",
  consumables: "Consumables",
};

export const cancelBookingReasons = [
  "My plans changed",
  "I booked the wrong day or garage",
  "The problem got sorted",
  "Other",
];

export const reminderTone: Record<ReminderStatus, StatusTone> = {
  ok: "success",
  "due-soon": "warning",
  overdue: "danger",
};

// The customer sees five stages; "ready" and "delivered" share the last one.
const trackerSteps: { label: string; stages: ServiceStage[] }[] = [
  { label: "Booked", stages: ["requested", "booked"] },
  { label: "Inspected", stages: ["inspected"] },
  { label: "Your approval", stages: ["awaiting-approval"] },
  { label: "In service", stages: ["in-service"] },
  { label: "Ready / Delivered", stages: ["ready", "delivered"] },
];

/** Steps for the live tracker, each with the time it was reached, and which one is in progress. */
export function getServiceProgress(job: ServiceJob): { steps: Step[]; activeStep: number } {
  const steps = trackerSteps.map(({ label, stages }) => {
    const reached = job.history.findLast((event) => stages.includes(event.stage));
    return { label, detail: reached ? formatDateTime(reached.at) : undefined };
  });
  const activeStep =
    job.stage === "delivered"
      ? steps.length
      : trackerSteps.findIndex(({ stages }) => stages.includes(job.stage));
  return { steps, activeStep };
}

const weekdays: Weekday[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

/** 0.4 → "Under 1 km", 5.5 → "5.5 km" */
export function formatDistance(km: number): string {
  return km < 1 ? "Under 1 km" : `${km} km`;
}

/** The garage's own starting price for a service, or null when it doesn't offer it. */
export function getGaragePrice(garage: Garage, serviceTypeId: string): number | null {
  return garage.services.find((s) => s.serviceTypeId === serviceTypeId)?.fromPriceInPaise ?? null;
}

/** "14:00" → "2:00 PM" */
function formatTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours < 12 ? "AM" : "PM";
  return `${hours % 12 || 12}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

/** "Mon–Sat · 9:00 AM–8:00 PM" */
export function formatOpeningHours({ days, opensAt, closesAt }: Garage["openingHours"]): string {
  const name = (day: Weekday) => day.charAt(0).toUpperCase() + day.slice(1);
  const indexes = days.map((day) => weekdays.indexOf(day));
  const isRange = indexes.every((value, i) => i === 0 || value === indexes[i - 1] + 1);
  const dayText =
    isRange && days.length > 2
      ? `${name(days[0])}–${name(days[days.length - 1])}`
      : days.map(name).join(", ");
  return `${dayText} · ${formatTime(opensAt)}–${formatTime(closesAt)}`;
}
