import { CircleCheck } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { ShopForVehicleLink } from "@/features/vehicles/components/ShopForVehicleLink";
import type { MyVehicle } from "@/features/vehicles/types";
import { getVehicleName } from "@/features/vehicles/utils";

export function AddVehicleSuccess({ vehicle }: { vehicle: MyVehicle }) {
  return (
    <Card aria-label="Vehicle added" className="grid justify-items-center gap-4 py-10 text-center">
      <CircleCheck className="size-14 text-success-700" strokeWidth={1.5} aria-hidden />
      <h2 className="text-xl font-semibold text-gray-900">
        {getVehicleName(vehicle)} added to your garage
      </h2>
      <p className="text-sm text-gray-600">Every part in the shop now shows whether it fits.</p>
      <div className="grid w-full max-w-sm gap-3">
        <Button asChild size="lg">
          <Link href={`/account?vehicle=${vehicle.id}`}>Go to my dashboard</Link>
        </Button>
        <Button asChild size="lg" variant="secondary">
          <ShopForVehicleLink vehicle={vehicle}>Shop parts for this vehicle</ShopForVehicleLink>
        </Button>
      </div>
    </Card>
  );
}
