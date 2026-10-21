import { cva } from "class-variance-authority";
import { Bike, CircleCheck, CircleX, Globe } from "lucide-react";

import { cn } from "@/lib/utils";

export type FitBadgeStatus = "fits" | "universal" | "no-fit" | "unknown";

const fitBadgeVariants = cva(
  "inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs leading-tight font-semibold",
  {
    variants: {
      status: {
        fits: "bg-success-50 text-success-700",
        universal: "bg-info-50 text-info-700",
        "no-fit": "bg-danger-50 text-danger-700",
        unknown: "bg-gray-100 text-gray-600",
      },
    },
  },
);

const icons = { fits: CircleCheck, universal: Globe, "no-fit": CircleX, unknown: Bike };

type FitBadgeProps = {
  status: FitBadgeStatus;
  /** "KTM Duke 200"; needed for "fits" and "no-fit". */
  vehicleName?: string;
  className?: string;
};

function label(status: FitBadgeStatus, vehicleName = "vehicle"): string {
  switch (status) {
    case "fits":
      return `Fits your ${vehicleName}`;
    case "universal":
      return "Universal fit";
    case "no-fit":
      return `Doesn't fit your ${vehicleName}`;
    case "unknown":
      return "Select your vehicle to check fit";
  }
}

/** The core promise: whether a part fits the customer's vehicle. */
export function FitBadge({ status, vehicleName, className }: FitBadgeProps) {
  const Icon = icons[status];
  return (
    <span className={cn(fitBadgeVariants({ status }), className)}>
      <Icon className="size-3.5 shrink-0" aria-hidden />
      {label(status, vehicleName)}
    </span>
  );
}
