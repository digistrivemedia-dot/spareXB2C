import { CircleCheck } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import type { ServiceJob } from "@/features/service/types";
import { formatDateTime } from "@/lib/format";

/** Shown once the booking is made: the job card number and what happens next. */
export function BookingConfirmed({ job }: { job: ServiceJob }) {
  return (
    <Card
      aria-label="Booking confirmed"
      className="grid justify-items-center gap-4 py-10 text-center"
    >
      <CircleCheck className="size-14 text-success-700" strokeWidth={1.5} aria-hidden />
      <h2 className="text-xl font-semibold text-gray-900">Your service is booked</h2>
      <p className="text-sm text-gray-700">
        Job card <span className="font-semibold text-gray-900">{job.jobCardNumber}</span> ·{" "}
        {job.serviceType} at {job.garage.name}
        {job.expectedReadyAt && <> on {formatDateTime(job.expectedReadyAt)}</>}
      </p>
      <p className="max-w-md text-sm text-gray-600">
        {job.isPickupAndDrop
          ? "Our rider will call you 30 minutes before pickup."
          : "Please bring your bike to the garage at your chosen time."}{" "}
        You can follow every step on your dashboard.
      </p>
      <div className="grid w-full max-w-sm gap-3">
        <Button asChild size="lg">
          <Link href={`/account?bike=${job.bikeId}`}>Go to my dashboard</Link>
        </Button>
        <Button asChild size="lg" variant="secondary">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </Card>
  );
}
