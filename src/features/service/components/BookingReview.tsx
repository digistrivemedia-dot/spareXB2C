import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Address } from "@/features/account/types";
import type { BookServiceInput, GarageOption, ServicePackage } from "@/features/service/types";
import { formatDistance, formatPickupWindow } from "@/features/service/utils";
import type { MyVehicle } from "@/features/vehicles/types";
import { formatPlate, getVehicleName } from "@/features/vehicles/utils";
import { formatDay, formatPrice } from "@/lib/format";

type BookingReviewProps = {
  vehicle: MyVehicle;
  /** Null when the customer described a problem instead. */
  servicePackage: ServicePackage | null;
  /** Null when Kannali assigns the best garage. */
  garage: GarageOption | null;
  date: string;
  pickupDrop: BookServiceInput["pickupDrop"];
  addresses: Address[];
  notes: string;
  onNotesChange: (notes: string) => void;
};

/** Everything chosen, one last time, with room for a note to the mechanic. */
export function BookingReview(props: BookingReviewProps) {
  const { vehicle, servicePackage, garage, date, pickupDrop, addresses, notes, onNotesChange } =
    props;
  const day = formatDay(new Date(`${date}T12:00:00+05:30`));
  const addressText = (id: string) => {
    const address = addresses.find((a) => a.id === id);
    return address ? `${address.label}: ${address.line1}, ${address.area}` : "";
  };
  const [from, to] = pickupDrop?.windowId.split("-") ?? [];
  const rows = [
    {
      label: "Vehicle",
      value: `${getVehicleName(vehicle)} · ${formatPlate(vehicle.registrationNumber)}`,
    },
    {
      label: "Service",
      value: servicePackage
        ? `${servicePackage.name} · ${formatPrice(servicePackage.priceInPaise)}`
        : "Check-up and repair · the garage quotes after inspecting",
    },
    {
      label: "Garage",
      value: garage
        ? [garage.name, garage.distanceKm !== null && `${formatDistance(garage.distanceKm)} away`]
            .filter(Boolean)
            .join(" · ")
        : "Best garage for you, assigned when you send",
    },
    ...(pickupDrop
      ? [
          { label: "Pickup", value: `${day}, ${formatPickupWindow({ from, to })}` },
          { label: "Pick up from", value: addressText(pickupDrop.pickupAddressId) },
          {
            label: "Drop at",
            value:
              pickupDrop.dropAddressId === pickupDrop.pickupAddressId
                ? "The same address"
                : addressText(pickupDrop.dropAddressId),
          },
          { label: "Pick and drop", value: "Free" },
        ]
      : [{ label: "Day", value: `${day}, bring it in during opening hours` }]),
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
        <Label htmlFor="booking-notes">
          {servicePackage
            ? "Anything the mechanic should know? (optional)"
            : "What's wrong with the vehicle?"}
        </Label>
        <Textarea
          id="booking-notes"
          value={notes}
          maxLength={300}
          placeholder="E.g. a noise from the front brake when braking hard"
          onChange={(event) => onNotesChange(event.target.value)}
        />
      </div>
      <p className="text-xs text-gray-500">
        Parts or work beyond the package come as an estimate for your approval. Nothing extra is
        done without your OK.
      </p>
    </div>
  );
}
