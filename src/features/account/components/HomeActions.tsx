import { ChevronRight, type LucideIcon, MapPin, ShoppingBag, Siren, Wrench } from "lucide-react";
import Link from "next/link";

import type { MyVehicle } from "@/features/vehicles/types";
import { getVehiclePartsHref } from "@/features/vehicles/utils";
import { BREAKDOWN_PHONE } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Action = {
  label: string;
  /** One line on why to tap it. */
  hint: string;
  href: string;
  icon: LucideIcon;
  /** Icon tile colours. */
  tone: string;
};

/** The four things customers come to do, each with a one-line reason. Booking a service is on the card above. */
export function HomeActions({ vehicle }: { vehicle: MyVehicle }) {
  const actions: Action[] = [
    {
      label: "Vehicle trouble?",
      hint: "Get it fixed at a top garage",
      href: `/services/book?vehicle=${vehicle.id}`,
      icon: Wrench,
      tone: "bg-navy-700 text-white",
    },
    {
      label: "Buy parts",
      hint: `Made for your ${vehicle.modelName}`,
      href: getVehiclePartsHref(vehicle),
      icon: ShoppingBag,
      tone: "bg-orange-700 text-white",
    },
    {
      label: "Find a garage",
      hint: "Top rated, near you",
      href: "/services/garages",
      icon: MapPin,
      tone: "bg-navy-50 text-navy-700",
    },
    {
      label: "Breakdown help",
      hint: "Call us now",
      href: `tel:+91${BREAKDOWN_PHONE}`,
      icon: Siren,
      tone: "bg-danger-50 text-danger-600",
    },
  ];

  return (
    <nav aria-label="Quick actions">
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {actions.map(({ label, hint, href, icon: Icon, tone }) => (
          <li key={label}>
            <Link
              href={href}
              className="group flex h-full items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-colors outline-none hover:border-navy-200 focus-visible:ring-3 focus-visible:ring-ring/50 md:p-4"
            >
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-xl md:size-11",
                  tone,
                )}
              >
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm leading-tight font-semibold text-gray-900">
                  {label}
                </span>
                <span className="block text-xs text-gray-500">{hint}</span>
              </span>
              <ChevronRight
                className="hidden size-4 shrink-0 text-gray-400 transition-transform group-hover:translate-x-0.5 md:block"
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
