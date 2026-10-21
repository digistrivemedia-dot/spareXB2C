import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { GarageOption, ServiceType } from "@/features/service/types";
import { formatDistance, getGaragePrice } from "@/features/service/utils";
import type { MyVehicle } from "@/features/vehicles/types";
import { formatPlate, getVehicleName } from "@/features/vehicles/utils";
import { formatDay, formatPrice } from "@/lib/format";

type BookingReviewProps = {
  vehicle: MyVehicle;
  serviceType: ServiceType;
  garage: GarageOption;
  date: string;
  notes: string;
  onNotesChange: (notes: string) => void;
};

/** Everything chosen, one last time, with room for a note to the mechanic. */
export function BookingReview(props: BookingReviewProps) {
  const { vehicle, serviceType, garage, date, notes, onNotesChange } = props;
  const price = getGaragePrice(garage, serviceType.id) ?? serviceType.fromPriceInPaise;
  const rows = [
    {
      label: "Vehicle",
      value: `${getVehicleName(vehicle)} · ${formatPlate(vehicle.registrationNumber)}`,
    },
    { label: "Service", value: `${serviceType.name} · from ${formatPrice(price)}` },
    {
      label: "Garage",
      value: [
        garage.name,
        garage.distanceKm !== null && `${formatDistance(garage.distanceKm)} away`,
      ]
        .filter(Boolean)
        .join(" · "),
    },
    {
      label: "Day",
      value: `${formatDay(new Date(`${date}T12:00:00+05:30`))}, during opening hours`,
    },
    { label: "To pay now", value: "Nothing. You pay after the work, online or at the garage." },
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
        The final bill depends on the work and parts needed. The garage sends an estimate for your
        approval before any extra work.
      </p>
    </div>
  );
}
