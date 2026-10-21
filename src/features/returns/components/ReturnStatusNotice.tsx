import { CircleCheck, CircleX, Clock, Truck } from "lucide-react";

import type { ReturnRequest } from "@/features/returns/types";
import { formatDate, formatDay, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

/** What's happening with the return now, and what the customer should do. */
export function ReturnStatusNotice({ request }: { request: ReturnRequest }) {
  const refund = `${formatPrice(request.refund.amountInPaise)} to your ${request.refund.to} account`;
  const refundedAt = request.history.findLast((e) => e.status === "refunded")?.at;

  const notices = {
    requested: {
      icon: Clock,
      tone: "warning",
      title: "We're checking your request",
      text: "We'll look at the reason and photos, then confirm a pickup day here.",
    },
    approved: {
      icon: Truck,
      tone: "info",
      title: request.pickupOn
        ? `Pickup on ${formatDay(new Date(`${request.pickupOn}T12:00:00+05:30`))}`
        : "Return approved",
      text: "Keep the parts in their box. The courier collects them from your address.",
    },
    "picked-up": {
      icon: Truck,
      tone: "info",
      title: "We've collected the parts",
      text: `Once they pass a check, we refund ${refund}.`,
    },
    refunded: {
      icon: CircleCheck,
      tone: "success",
      title: "Refunded",
      text: `${refund}${refundedAt ? ` on ${formatDate(refundedAt)}` : ""}. Your bank may take a few working days to show it.`,
    },
    rejected: {
      icon: CircleX,
      tone: "danger",
      title: "We couldn't accept this return",
      text: request.rejectionReason ?? "Please call us to talk it through.",
    },
  } as const;
  const notice = notices[request.status];

  return (
    <div
      role="status"
      className={cn(
        "flex gap-3 rounded-xl border p-4 text-sm",
        notice.tone === "warning" && "border-warning-500 bg-warning-50",
        notice.tone === "info" && "border-navy-200 bg-navy-50",
        notice.tone === "success" && "border-success-600 bg-success-50",
        notice.tone === "danger" && "border-danger-600 bg-danger-50",
      )}
    >
      <notice.icon className="mt-0.5 size-5 shrink-0 text-navy-700" aria-hidden />
      <div>
        <p className="font-semibold text-gray-900">{notice.title}</p>
        <p className="text-gray-700">{notice.text}</p>
      </div>
    </div>
  );
}
