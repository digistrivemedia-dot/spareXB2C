import type { StatusTone } from "@/components/ui/StatusBadge";
import type { Step } from "@/components/ui/Stepper";
import type {
  Estimate,
  EstimateLine,
  EstimateLineKind,
  Garage,
  JobAddress,
  NextServiceDue,
  PickupDrop,
  ServiceJob,
  ServiceStage,
  Weekday,
} from "@/features/service/types";
import { formatDateTime } from "@/lib/format";

export const serviceStageLabel: Record<ServiceStage, string> = {
  requested: "Waiting for the garage",
  booked: "Booked",
  "picked-up": "Picked up",
  inspected: "Inspected",
  "awaiting-approval": "Your approval needed",
  "in-service": "In service",
  ready: "Ready",
  "out-for-drop": "Out for drop",
  delivered: "Delivered",
  declined: "Declined by the garage",
  cancelled: "Cancelled",
};

export const serviceStageTone: Record<ServiceStage, StatusTone> = {
  requested: "warning",
  booked: "info",
  "picked-up": "info",
  inspected: "info",
  "awaiting-approval": "warning",
  "in-service": "info",
  ready: "success",
  "out-for-drop": "info",
  delivered: "success",
  declined: "danger",
  cancelled: "neutral",
};

// Once the work has started, the customer talks to the garage instead of cancelling in the app.
const cancellableStages: ServiceStage[] = [
  "requested",
  "booked",
  "picked-up",
  "inspected",
  "awaiting-approval",
];

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

type TrackerStep = { label: string; stages: ServiceStage[] };

// The customer sees five stages; "ready" and "delivered" share the last one.
const trackerSteps: TrackerStep[] = [
  { label: "Booked", stages: ["requested", "booked"] },
  { label: "Inspected", stages: ["inspected"] },
  { label: "Your approval", stages: ["awaiting-approval"] },
  { label: "In service", stages: ["in-service"] },
  { label: "Ready / Delivered", stages: ["ready", "delivered"] },
];

// With pick and drop, the vehicle's trips to and from the garage are steps too.
const pickupDropTrackerSteps: TrackerStep[] = [
  { label: "Booked", stages: ["requested", "booked"] },
  { label: "Picked up", stages: ["picked-up"] },
  { label: "At the garage", stages: ["inspected"] },
  { label: "Your approval", stages: ["awaiting-approval"] },
  { label: "In service", stages: ["in-service"] },
  { label: "Out for drop", stages: ["ready", "out-for-drop"] },
  { label: "Dropped off", stages: ["delivered"] },
];

/** Steps for the live tracker, each with the time it was reached, and which one is in progress. */
export function getServiceProgress(job: ServiceJob): { steps: Step[]; activeStep: number } {
  const tracker = job.pickupDrop ? pickupDropTrackerSteps : trackerSteps;
  const steps = tracker.map(({ label, stages }) => {
    const reached = job.history.findLast((event) => stages.includes(event.stage));
    return { label, detail: reached ? formatDateTime(reached.at) : undefined };
  });
  const activeStep =
    job.stage === "delivered"
      ? steps.length
      : tracker.findIndex(({ stages }) => stages.includes(job.stage));
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

/** Pickup windows on the booked day; a garage offers the ones inside its opening hours. */
const pickupWindows: PickupDrop["window"][] = [
  { from: "09:00", to: "12:00" },
  { from: "12:00", to: "15:00" },
  { from: "15:00", to: "18:00" },
];

/** Without a garage (Kannali assigns one), every window; the request only goes to garages open then. */
export function getPickupWindows(garage: Garage | null): PickupDrop["window"][] {
  if (!garage) return pickupWindows;
  const { opensAt, closesAt } = garage.openingHours;
  return pickupWindows.filter((w) => w.from >= opensAt && w.to <= closesAt);
}

/** { from: "09:00", to: "12:00" } → "09:00-12:00", the id the booking sends. */
export function getPickupWindowId(window: PickupDrop["window"]): string {
  return `${window.from}-${window.to}`;
}

/** "9:00 AM–12:00 PM" */
export function formatPickupWindow(window: PickupDrop["window"]): string {
  return `${formatTime(window.from)}–${formatTime(window.to)}`;
}

/** "12, 4th Cross, Whitefield, Bengaluru 560066" */
export function formatJobAddress(address: JobAddress): string {
  return `${address.line1}, ${address.area}, ${address.city} ${address.pin}`;
}

/** Whether the vehicle goes back to the address it was picked up from. */
export function isSameAddress(a: JobAddress, b: JobAddress): boolean {
  return formatJobAddress(a) === formatJobAddress(b);
}

/** How long each garage has to accept a booking before it goes to the next one. */
export const GARAGE_ACCEPT_SECONDS = 5;

const DAY_IN_MS = 24 * 60 * 60 * 1000;

/**
 * How close the next service is: km and days left (never below 0), and how much of the gap since the last
 * service is used up (0–100), by whichever of km or days is closer.
 */
export function getServiceDueProgress(
  due: NextServiceDue,
  odometerKm: number,
  last: { odometerKm: number; completedOn: string } | null,
  today: Date,
): { kmLeft: number; daysLeft: number; percent: number } {
  const kmLeft = Math.max(0, due.dueAtKm - odometerKm);
  const dueOn = new Date(`${due.dueOn}T00:00:00+05:30`).getTime();
  const daysLeft = Math.max(0, Math.ceil((dueOn - today.getTime()) / DAY_IN_MS));
  if (!last) return { kmLeft, daysLeft, percent: 0 };
  const lastOn = new Date(`${last.completedOn}T00:00:00+05:30`).getTime();
  const kmShare = (odometerKm - last.odometerKm) / Math.max(1, due.dueAtKm - last.odometerKm);
  const dayShare = (today.getTime() - lastOn) / Math.max(DAY_IN_MS, dueOn - lastOn);
  const percent = Math.round(Math.min(1, Math.max(0, kmShare, dayShare)) * 100);
  return { kmLeft, daysLeft, percent };
}
