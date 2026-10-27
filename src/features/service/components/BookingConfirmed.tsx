import { CircleCheck } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import type { ServiceJob } from "@/features/service/types";
import { formatPickupWindow } from "@/features/service/utils";
import { formatDay } from "@/lib/format";

/** Shown once a garage accepts: who took it, when, and what happens next. */
export function BookingConfirmed({ job }: { job: ServiceJob }) {
  return (
    <Card
      aria-label="Booking confirmed"
      className="grid justify-items-center gap-4 py-10 text-center"
    >
      <CircleCheck className="size-14 text-success-700" strokeWidth={1.5} aria-hidden />
      <div className="grid gap-1">
        <h2 className="text-xl font-semibold text-gray-900">Booked with {job.garage.name}</h2>
        <p className="text-sm text-gray-700">
          <span className="font-semibold text-gray-900">{job.serviceType}</span> on{" "}
          {formatDay(new Date(`${job.scheduledOn}T12:00:00+05:30`))} · Booking {job.jobCardNumber}
        </p>
      </div>
      <p className="max-w-md text-sm text-gray-600">
        {job.pickupDrop
          ? `Free pick and drop: someone from the garage picks it up between ${formatPickupWindow(job.pickupDrop.window)} from ${job.pickupDrop.pickupAddress.label}. You'll see their name and number before then.`
          : "Bring your vehicle any time during the garage's hours that day."}{" "}
        Nothing to pay now. Follow every step in My services.
      </p>
      <div className="grid w-full max-w-sm gap-3">
        <Button asChild size="lg">
          <Link href={`/account/services/${job.id}`}>Track this service</Link>
        </Button>
        <Button asChild size="lg" variant="secondary">
          <Link href={`/account?vehicle=${job.vehicleId}`}>Go to my home</Link>
        </Button>
      </div>
    </Card>
  );
}
