import { CircleCheck } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import type { ServiceJob } from "@/features/service/types";
import { formatDay } from "@/lib/format";

/** Shown once the booking is sent: what was booked, and what happens next. */
export function BookingConfirmed({ job }: { job: ServiceJob }) {
  return (
    <Card aria-label="Booking sent" className="grid justify-items-center gap-4 py-10 text-center">
      <CircleCheck className="size-14 text-success-700" strokeWidth={1.5} aria-hidden />
      <h2 className="text-xl font-semibold text-gray-900">Booking sent to the garage</h2>
      <p className="text-sm text-gray-700">
        <span className="font-semibold text-gray-900">{job.serviceType}</span> at {job.garage.name}{" "}
        on {formatDay(new Date(`${job.scheduledOn}T12:00:00+05:30`))} · Booking {job.jobCardNumber}
      </p>
      <p className="max-w-md text-sm text-gray-600">
        The garage confirms it shortly; you&apos;ll see it change to &quot;Booked&quot; in My
        services. Bring your vehicle any time during opening hours that day. Nothing to pay now.
      </p>
      <div className="grid w-full max-w-sm gap-3">
        <Button asChild size="lg">
          <Link href="/account/services">See my services</Link>
        </Button>
        <Button asChild size="lg" variant="secondary">
          <Link href={`/account?vehicle=${job.vehicleId}`}>Go to my dashboard</Link>
        </Button>
      </div>
    </Card>
  );
}
