import Image from "next/image";

import { VehicleTypeIcon } from "@/features/vehicles/components/VehicleTypeIcon";
import type { MyVehicle } from "@/features/vehicles/types";
import { cn } from "@/lib/utils";

type VehiclePhotoProps = {
  vehicle: Pick<MyVehicle, "type" | "photos">;
  /** The `sizes` hint for next/image, matching how wide the photo is drawn. */
  sizes: string;
  className?: string;
};

/** The vehicle's main photo (4:3), or its type's icon on grey until the customer adds one. */
export function VehiclePhoto({ vehicle, sizes, className }: VehiclePhotoProps) {
  const photo = vehicle.photos[0];
  return (
    <div
      className={cn(
        "relative flex aspect-4/3 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 text-gray-400",
        className,
      )}
    >
      {photo ? (
        <Image src={photo.url} alt={photo.alt} fill sizes={sizes} className="object-cover" />
      ) : (
        <VehicleTypeIcon type={vehicle.type} className="size-1/3" strokeWidth={1.5} />
      )}
    </div>
  );
}
