import type { StatusTone } from "@/components/ui/StatusBadge";
import type { Step } from "@/components/ui/Stepper";
import type {
  BikeReminders,
  Garage,
  ReminderStatus,
  ServiceJob,
  ServiceStage,
  Weekday,
} from "@/features/service/types";
import { formatDate, formatDateTime, formatKm } from "@/lib/format";

export const reminderTone: Record<ReminderStatus, StatusTone> = {
  ok: "success",
  "due-soon": "warning",
  overdue: "danger",
};

export type ReminderItem = {
  key: string;
  title: string;
  value: string;
  status: ReminderStatus;
  statusLabel: string;
};

/** The four things a rider must keep on top of, in display order. */
export function getReminderItems({
  nextService,
  insurance,
  puc,
  rc,
}: BikeReminders): ReminderItem[] {
  const documentStatus = { ok: "Valid", "due-soon": "Renew soon", overdue: "Expired" } as const;
  return [
    {
      key: "service",
      title: "Next service",
      value: `${formatDate(nextService.dueOn)} or ${formatKm(nextService.dueAtKm)}`,
      status: nextService.status,
      statusLabel: { ok: "On track", "due-soon": "Due soon", overdue: "Overdue" }[
        nextService.status
      ],
    },
    {
      key: "insurance",
      title: "Insurance",
      value: `${insurance.provider} · till ${formatDate(insurance.expiresOn)}`,
      status: insurance.status,
      statusLabel: documentStatus[insurance.status],
    },
    {
      key: "puc",
      title: "PUC",
      value: `Till ${formatDate(puc.expiresOn)}`,
      status: puc.status,
      statusLabel: documentStatus[puc.status],
    },
    {
      key: "rc",
      title: "RC",
      value: `Till ${formatDate(rc.expiresOn)}`,
      status: rc.status,
      statusLabel: documentStatus[rc.status],
    },
  ];
}

// The customer sees five stages; "ready" and "delivered" share the last one.
const trackerSteps: { label: string; stages: ServiceStage[] }[] = [
  { label: "Booked", stages: ["booked"] },
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

/** "14:00" → "2:00 PM" */
export function formatTime(time: string): string {
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
