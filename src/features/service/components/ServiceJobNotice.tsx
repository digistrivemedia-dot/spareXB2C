import {
  CalendarCheck,
  CircleCheck,
  CircleX,
  ClipboardCheck,
  Clock,
  IndianRupee,
  type LucideIcon,
  Wrench,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { ServiceJob } from "@/features/service/types";
import { getEstimateTotal, getPendingEstimate } from "@/features/service/utils";
import { formatDateTime, formatDay, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

type Notice = {
  icon: LucideIcon;
  tone: "warning" | "info" | "success" | "danger" | "neutral";
  title: string;
  text: string;
  action?: { href: string; label: string };
};

const toneClasses = {
  warning: "border-warning-500 bg-warning-50",
  info: "border-navy-200 bg-navy-50",
  success: "border-success-600 bg-success-50",
  danger: "border-danger-600 bg-danger-50",
  neutral: "border-gray-200 bg-white",
};

/** What's happening with the booking now, and the one thing the customer may need to do. */
export function ServiceJobNotice({ job }: { job: ServiceJob }) {
  const day = formatDay(new Date(`${job.scheduledOn}T12:00:00+05:30`));
  const base = `/account/services/${job.id}`;
  const estimate = getPendingEstimate(job);

  const notices: Record<ServiceJob["stage"], Notice> = {
    requested: {
      icon: Clock,
      tone: "warning",
      title: `Waiting for ${job.garage.name} to confirm`,
      text: `You asked for ${day}. We'll show it here as soon as the garage accepts.`,
    },
    booked: {
      icon: CalendarCheck,
      tone: "info",
      title: `Booked for ${day}`,
      text: "Bring your vehicle in any time during the garage's opening hours that day.",
    },
    inspected: {
      icon: Wrench,
      tone: "info",
      title: "Your vehicle has been checked in",
      text: "The garage is looking it over and will send an estimate if anything else needs work.",
      action: { href: `${base}/job-card`, label: "See the job card" },
    },
    "awaiting-approval": {
      icon: ClipboardCheck,
      tone: "warning",
      title: "The garage needs your approval",
      text: estimate
        ? `Extra work worth ${formatPrice(getEstimateTotal(estimate))}. Approve the items you want; the rest won't be done.`
        : "Approve the items you want; the rest won't be done.",
      action: { href: `${base}/estimate`, label: "Review & approve" },
    },
    "in-service": {
      icon: Wrench,
      tone: "info",
      title: "Work in progress",
      text: job.expectedReadyAt
        ? `Expected ready by ${formatDateTime(job.expectedReadyAt)}.`
        : "The garage will let you know when it's ready.",
    },
    ready: {
      icon: IndianRupee,
      tone: "success",
      title: "Ready to collect",
      text:
        job.bill?.payment.status === "paid"
          ? "Paid. Collect your vehicle during opening hours."
          : `Pay ${formatPrice(job.bill?.totalInPaise ?? 0)} online now, or at the garage when you collect.`,
      action:
        job.bill?.payment.status === "paid" ? undefined : { href: `${base}/pay`, label: "Pay now" },
    },
    delivered: {
      icon: CircleCheck,
      tone: "success",
      title: "Done",
      text: job.review
        ? `You rated this visit ${job.review.rating} out of 5. Thank you.`
        : "How did it go? Your rating helps the garage and other customers.",
    },
    declined: {
      icon: CircleX,
      tone: "danger",
      title: "The garage couldn't take this booking",
      text: job.closedReason ?? "Please choose another day or garage.",
      action: {
        href: `/services/book?garage=${job.garage.slug}&vehicle=${job.vehicleId}`,
        label: "Book another day",
      },
    },
    cancelled: {
      icon: CircleX,
      tone: "neutral",
      title: "You cancelled this booking",
      text: job.closedReason ? `Reason: ${job.closedReason}` : "Nothing was charged.",
    },
  };
  const notice = notices[job.stage];

  return (
    <div
      role="status"
      className={cn(
        "flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center md:p-5",
        toneClasses[notice.tone],
      )}
    >
      <notice.icon className="size-6 shrink-0 text-navy-700" aria-hidden />
      <div className="flex-1 text-sm">
        <p className="font-semibold text-gray-900">{notice.title}</p>
        <p className="text-gray-700">{notice.text}</p>
      </div>
      {notice.action && (
        <Button asChild className="sm:shrink-0">
          <Link href={notice.action.href}>{notice.action.label}</Link>
        </Button>
      )}
    </div>
  );
}
