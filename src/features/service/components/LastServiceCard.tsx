import { Check, Wrench } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { ServiceRecord } from "@/features/service/types";
import { formatDate, formatKm, formatPrice } from "@/lib/format";

export function LastServiceCard({ record }: { record: ServiceRecord | null }) {
  return (
    <Card aria-labelledby="last-service-heading" className="flex flex-col">
      <SectionHeader id="last-service-heading" title="Last service" />
      {record ? (
        <>
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-gray-900">{formatDate(record.completedOn)}</span> ·{" "}
            {formatKm(record.odometerKm)} · {record.serviceType}
          </p>
          <ul className="mt-3 grid gap-1.5 text-sm text-gray-700">
            {record.workDone.map((work) => (
              <li key={work} className="flex gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-success-700" aria-hidden />
                {work}
              </li>
            ))}
          </ul>
          <div className="mt-auto flex items-center justify-between gap-3 border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-700">
              Bill total{" "}
              <span className="font-semibold text-gray-900 tabular-nums">
                {formatPrice(record.billTotalInPaise)}
              </span>
            </p>
            <Button asChild variant="secondary" size="sm">
              <Link href={`/account/services/${record.id}`}>View bill</Link>
            </Button>
          </div>
        </>
      ) : (
        <EmptyState
          icon={Wrench}
          titleAs="h3"
          title="No services yet"
          description="Your service history will show up here after your first visit."
          className="py-6"
        >
          <Button asChild>
            <Link href="/services/book">Book a service</Link>
          </Button>
        </EmptyState>
      )}
    </Card>
  );
}
