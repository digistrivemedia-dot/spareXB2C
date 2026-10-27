import { Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { ServiceJob } from "@/features/service/types";
import { formatJobAddress, formatPickupWindow, isSameAddress } from "@/features/service/utils";
import { formatDay, formatMobile } from "@/lib/format";

type PickupDropCardProps = {
  job: ServiceJob & { pickupDrop: NonNullable<ServiceJob["pickupDrop"]> };
};

/** When and where the garage collects the vehicle, where it goes back, and who is doing it. */
export function PickupDropCard({ job }: PickupDropCardProps) {
  const { window, pickupAddress, dropAddress, staff } = job.pickupDrop;
  const rows = [
    {
      label: "Pickup",
      value: `${formatDay(new Date(`${job.scheduledOn}T12:00:00+05:30`))}, ${formatPickupWindow(window)}`,
    },
    { label: `Pick up from · ${pickupAddress.label}`, value: formatJobAddress(pickupAddress) },
    {
      label: `Drop at · ${dropAddress.label}`,
      value: isSameAddress(pickupAddress, dropAddress)
        ? "The same address"
        : formatJobAddress(dropAddress),
    },
  ];

  return (
    <Card aria-labelledby="pickup-drop-heading" className="grid content-start gap-4">
      <SectionHeader id="pickup-drop-heading" title="Pick and drop · Free" />
      <dl className="grid gap-3 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="grid gap-0.5">
            <dt className="text-gray-500">{row.label}</dt>
            <dd className="font-medium text-gray-900">{row.value}</dd>
          </div>
        ))}
        <div className="grid gap-0.5">
          <dt className="text-gray-500">From the garage</dt>
          <dd className="font-medium text-gray-900">
            {staff ? staff.name : "You'll see their name and number once the garage confirms."}
          </dd>
        </div>
      </dl>
      {staff && (
        <Button asChild variant="secondary" size="sm" className="w-fit">
          <a href={`tel:+91${staff.phone}`}>
            <Phone aria-hidden />
            Call {staff.name.split(" ")[0]} · {formatMobile(staff.phone)}
          </a>
        </Button>
      )}
    </Card>
  );
}
