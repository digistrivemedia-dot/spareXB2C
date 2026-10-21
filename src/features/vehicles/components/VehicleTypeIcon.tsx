import { Bike, Car, type LucideProps, Truck } from "lucide-react";

import type { VehicleType } from "@/features/vehicles/types";

const icons = { bike: Bike, scooter: Bike, car: Car, commercial: Truck };

/** The icon for a kind of vehicle; with no vehicle selected, the bike icon stands for "your vehicle". */
export function VehicleTypeIcon({ type = "bike", ...props }: LucideProps & { type?: VehicleType }) {
  const Icon = icons[type];
  return <Icon aria-hidden {...props} />;
}
