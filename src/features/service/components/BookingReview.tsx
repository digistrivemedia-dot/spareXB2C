import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Address } from "@/features/account/types";
import type { GarageOption, ServiceType } from "@/features/service/types";
import { formatTime } from "@/features/service/utils";
import type { MyBike } from "@/features/vehicles/types";
import { getBikeName } from "@/features/vehicles/utils";
import { formatDay, formatPrice, formatRegistration } from "@/lib/format";

type BookingReviewProps = {
  bike: MyBike;
  serviceType: ServiceType;
  garage: GarageOption;
  date: string;
  time: string;
  pickupAddress: Address | null;
  notes: string;
  onNotesChange: (notes: string) => void;
};

/** Everything chosen, one last time, with room for a note to the mechanic. */
export function BookingReview(props: BookingReviewProps) {
  const { bike, serviceType, garage, date, time, pickupAddress, notes, onNotesChange } = props;
  const rows = [
    {
      label: "Bike",
      value: `${getBikeName(bike)} · ${formatRegistration(bike.registrationNumber)}`,
    },
    {
      label: "Service",
      value: `${serviceType.name} · from ${formatPrice(serviceType.fromPriceInPaise)}`,
    },
    { label: "Garage", value: `${garage.name} · ${garage.distanceKm} km away` },
    {
      label: "When",
      value: `${formatDay(new Date(`${date}T12:00:00+05:30`))}, ${formatTime(time)}`,
    },
    {
      label: "Pickup",
      value: pickupAddress
        ? `Free pickup and drop from ${pickupAddress.label} (${pickupAddress.area})`
        : "You'll drop the bike at the garage",
    },
  ];

  return (
    <div className="grid gap-5">
      <dl className="grid gap-3 rounded-xl border border-gray-200 bg-white p-4 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="grid gap-0.5 sm:grid-cols-4 sm:gap-4">
            <dt className="text-gray-500">{row.label}</dt>
            <dd className="font-medium text-gray-900 sm:col-span-3">{row.value}</dd>
          </div>
        ))}
      </dl>
      <div className="grid gap-2">
        <Label htmlFor="booking-notes">Anything the mechanic should know? (optional)</Label>
        <Textarea
          id="booking-notes"
          value={notes}
          maxLength={300}
          placeholder="E.g. a noise from the front brake when braking hard"
          onChange={(event) => onNotesChange(event.target.value)}
        />
      </div>
      <p className="text-xs text-gray-500">
        The final bill depends on the work and parts needed. We&apos;ll send an estimate for your
        approval before any extra work.
      </p>
    </div>
  );
}
