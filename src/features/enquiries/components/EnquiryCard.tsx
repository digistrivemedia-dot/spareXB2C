import { MessageSquareText } from "lucide-react";

import { ImageViewer } from "@/components/ui/ImageViewer";
import { StatusBadge, type StatusTone } from "@/components/ui/StatusBadge";
import type { Enquiry, EnquiryReason, EnquiryStatus } from "@/features/enquiries/types";
import { formatDate, formatDateTime } from "@/lib/format";

const statuses: Record<EnquiryStatus, { label: string; tone: StatusTone }> = {
  open: { label: "Waiting for a reply", tone: "warning" },
  answered: { label: "Answered", tone: "success" },
  closed: { label: "Closed", tone: "neutral" },
};

const reasonLabels: Record<EnquiryReason, string> = {
  "vehicle-not-listed": "Vehicle not in the list",
  "part-not-found": "Looking for a part",
};

/** One enquiry: what the customer asked, and the parts team's reply when there is one. */
export function EnquiryCard({ enquiry }: { enquiry: Enquiry }) {
  const status = statuses[enquiry.status];

  return (
    <article
      aria-labelledby={`enquiry-${enquiry.id}`}
      className="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div>
          <h2 id={`enquiry-${enquiry.id}`} className="font-semibold text-gray-900">
            {enquiry.partNeeded ?? reasonLabels[enquiry.reason]}
          </h2>
          <p className="text-sm text-gray-600">
            {enquiry.vehicle.name} · {enquiry.number} · {formatDate(enquiry.createdAt)}
          </p>
        </div>
        <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
      </div>
      {enquiry.message && <p className="text-sm text-gray-700">{enquiry.message}</p>}
      {enquiry.photos.length > 0 && (
        <ImageViewer photos={enquiry.photos} label={`Photos sent with ${enquiry.number}`} />
      )}
      {enquiry.reply && (
        <div className="grid gap-1 rounded-lg bg-navy-50 p-3 text-sm">
          <p className="flex items-center gap-2 font-semibold text-navy-800">
            <MessageSquareText className="size-4" aria-hidden />
            Reply from our parts team · {formatDateTime(enquiry.reply.at)}
          </p>
          <p className="text-gray-700">{enquiry.reply.text}</p>
        </div>
      )}
    </article>
  );
}
