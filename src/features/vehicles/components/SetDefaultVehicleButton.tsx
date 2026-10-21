"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { setDefaultVehicleAction } from "@/features/vehicles/actions";

type SetDefaultVehicleButtonProps = {
  vehicleId: string;
  vehicleName: string;
};

/** The default vehicle opens first on the dashboard. */
export function SetDefaultVehicleButton({ vehicleId, vehicleName }: SetDefaultVehicleButtonProps) {
  const [isPending, startTransition] = useTransition();

  function setDefault() {
    startTransition(async () => {
      const result = await setDefaultVehicleAction(vehicleId);
      if (result.ok) toast.success(`${vehicleName} is now your default vehicle`);
      else toast.error(result.message);
    });
  }

  return (
    <Button variant="ghost" size="sm" onClick={setDefault} disabled={isPending}>
      {isPending ? "Saving…" : "Set as default"}
    </Button>
  );
}
