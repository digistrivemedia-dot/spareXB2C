"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { removeVehicleAction } from "@/features/vehicles/actions";

type RemoveVehicleButtonProps = {
  vehicleId: string;
  vehicleName: string;
};

export function RemoveVehicleButton({ vehicleId, vehicleName }: RemoveVehicleButtonProps) {
  const router = useRouter();

  async function remove() {
    const result = await removeVehicleAction(vehicleId);
    if (!result.ok) {
      toast.error(result.message);
      return false;
    }
    toast.success(`${vehicleName} removed`);
    router.push("/account/vehicles");
  }

  return (
    <ConfirmDialog
      trigger={
        <Button variant="destructive" size="sm">
          <Trash2 aria-hidden />
          Remove vehicle
        </Button>
      }
      title={`Remove your ${vehicleName}?`}
      description="Its papers and photos are removed from your account. Past orders and service bills stay."
      confirmLabel="Remove vehicle"
      tone="destructive"
      onConfirm={remove}
    />
  );
}
