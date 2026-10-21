import { FileText } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { PriceRow } from "@/components/ui/PriceRow";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { ReturnRequest } from "@/features/returns/types";
import { formatDate, formatPrice } from "@/lib/format";

/** The refund (amount, where it goes, reference) and the credit note once it's issued. */
export function ReturnRefundCard({ request }: { request: ReturnRequest }) {
  const { refund, creditNote } = request;
  const isRefunded = request.status === "refunded";

  return (
    <Card aria-labelledby="refund-heading" className="grid content-start gap-4">
      <SectionHeader id="refund-heading" title="Refund" />
      <dl className="grid gap-2 text-sm">
        <PriceRow label="Amount" value={formatPrice(refund.amountInPaise)} />
        <PriceRow label="Refunded to" value={refund.to} />
        <PriceRow
          label="Status"
          value={isRefunded ? "Refunded" : request.status === "rejected" ? "No refund" : "Pending"}
        />
        {refund.reference && <PriceRow label="Reference" value={refund.reference} />}
      </dl>
      {creditNote ? (
        <div className="grid gap-3 border-t border-gray-200 pt-4 text-sm">
          <p className="text-gray-700">
            Credit note {creditNote.number} · {formatDate(creditNote.issuedAt)}
          </p>
          <Button asChild variant="secondary" className="sm:w-fit">
            <Link href={`/account/returns/${request.id}/credit-note`}>
              <FileText aria-hidden />
              View credit note
            </Link>
          </Button>
        </div>
      ) : (
        request.status !== "rejected" && (
          <p className="border-t border-gray-200 pt-4 text-sm text-gray-600">
            A credit note is issued with the refund, for your GST records.
          </p>
        )
      )}
    </Card>
  );
}
