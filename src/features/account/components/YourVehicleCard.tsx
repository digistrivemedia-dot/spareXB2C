import {
  CircleAlert,
  CircleCheck,
  CircleDashed,
  CircleX,
  type LucideIcon,
  Settings2,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import type { StatusTone } from "@/components/ui/StatusBadge";
import { OtherVehicles } from "@/features/account/components/OtherVehicles";
import { OdometerDialog } from "@/features/vehicles/components/OdometerDialog";
import { VehiclePhoto } from "@/features/vehicles/components/VehiclePhoto";
import type { MyVehicle } from "@/features/vehicles/types";
import {
  documentLabels,
  documentStatusLabels,
  documentStatusTones,
  getVehicleName,
  getVehiclePartsHref,
} from "@/features/vehicles/utils";
import { formatDate, formatKm, formatRegistration } from "@/lib/format";
import { cn } from "@/lib/utils";

const toneStyle: Record<StatusTone, { icon: LucideIcon; className: string }> = {
  success: { icon: CircleCheck, className: "text-success-700" },
  warning: { icon: CircleAlert, className: "text-warning-700" },
  danger: { icon: CircleX, className: "text-danger-700" },
  info: { icon: CircleCheck, className: "text-info-700" },
  neutral: { icon: CircleDashed, className: "text-gray-500" },
};

/** One fact about the vehicle: a small label over its value. */
function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid content-start gap-1 rounded-lg bg-gray-50 px-3 py-3">
      <dt className="text-xs text-gray-500">{label}</dt>
      <dd className="text-sm">{children}</dd>
    </div>
  );
}

/**
 * The chosen vehicle: number plate first, then the name; odometer and papers in a compact 2×2 grid; a shortcut to its
 * parts; and the customer's other vehicles, to switch to.
 */
export function YourVehicleCard({
  vehicle,
  vehicles,
}: {
  vehicle: MyVehicle;
  vehicles: MyVehicle[];
}) {
  const name = getVehicleName(vehicle);
  const detailsHref = `/account/vehicles/${vehicle.id}`;

  return (
    <Card
      aria-labelledby="your-vehicle-heading"
      className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-4 gap-y-4 [grid-template-areas:'photo_head'_'body_body'_'others_others'] sm:grid-cols-[12rem_minmax(0,1fr)] sm:grid-rows-[auto_auto_1fr] sm:gap-x-5 sm:[grid-template-areas:'photo_head'_'photo_body'_'others_body'] lg:grid-cols-[15rem_minmax(0,1fr)]"
    >
      {/* Phones: a small photo beside the name, details and other vehicles full width below.
          Wider: the photo and other vehicles in a column beside the details. */}
      <Link
        href={detailsHref}
        className="self-start [grid-area:photo]"
        aria-label={`${name} details`}
      >
        <VehiclePhoto
          vehicle={vehicle}
          sizes="(min-width: 1024px) 240px, (min-width: 640px) 192px, 88px"
          isAboveFold
          className="w-full rounded-xl"
        />
      </Link>

      <div className="flex min-w-0 items-start justify-between gap-3 [grid-area:head]">
        <div className="grid min-w-0 justify-items-start gap-1.5">
          {vehicle.registrationNumber ? (
            <p className="rounded-md border-2 border-gray-900 bg-white px-2 py-0.5 text-sm font-bold tracking-widest text-gray-900">
              <span className="sr-only">Registration number </span>
              {formatRegistration(vehicle.registrationNumber)}
            </p>
          ) : (
            <Link
              href={`${detailsHref}/edit`}
              className="text-sm font-semibold text-navy-700 hover:underline"
            >
              Add number plate
            </Link>
          )}
          <div>
            <h2 id="your-vehicle-heading" className="text-lg font-semibold text-gray-900">
              {name}
            </h2>
            <p className="text-sm text-gray-500">
              {vehicle.variantName} · {vehicle.year}
            </p>
          </div>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link href={detailsHref}>
            <Settings2 aria-hidden />
            <span className="sr-only sm:not-sr-only">Manage</span>
          </Link>
        </Button>
      </div>

      <div className="[grid-area:others]">
        <OtherVehicles vehicles={vehicles} currentVehicleId={vehicle.id} />
      </div>

      <div className="flex min-w-0 flex-col gap-4 [grid-area:body]">
        <dl className="grid grid-cols-2 gap-2.5">
          <Fact label="Odometer">
            <span className="flex flex-wrap items-baseline gap-x-2">
              <span className="font-semibold text-gray-900 tabular-nums">
                {formatKm(vehicle.odometerKm)}
              </span>
              <OdometerDialog
                vehicleId={vehicle.id}
                vehicleName={name}
                currentKm={vehicle.odometerKm}
                updatedAt={vehicle.odometerUpdatedAt}
              />
            </span>
          </Fact>
          {vehicle.documents.map((document) => {
            const { icon: Icon, className } = toneStyle[documentStatusTones[document.status]];
            return (
              <Fact key={document.kind} label={documentLabels[document.kind]}>
                <span className={cn("flex items-center gap-1.5 font-semibold", className)}>
                  <Icon className="size-4 shrink-0" aria-hidden />
                  {documentStatusLabels[document.status]}
                </span>
                {document.expiresOn && (
                  <span className="block text-xs text-gray-500">
                    till {formatDate(document.expiresOn)}
                  </span>
                )}
              </Fact>
            );
          })}
        </dl>

        {/* Pinned to the bottom, level with "Book this service" in the card beside it. */}
        <div className="mt-auto">
          <Button asChild variant="secondary" size="sm">
            <Link href={getVehiclePartsHref(vehicle)}>
              <ShoppingBag aria-hidden />
              Buy parts for your {vehicle.modelName}
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
