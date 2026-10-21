"use client";

import { LogOut } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { logOutDeviceAction, logOutOtherDevicesAction } from "@/features/account/actions";
import type { DeviceSession } from "@/features/account/types";

type DeviceLogOutButtonProps = {
  /** The device to log out; without one, the button logs out every device except this one. */
  session?: DeviceSession;
  otherCount?: number;
};

/** Logs out one other device, or all of them, after asking. */
export function DeviceLogOutButton({ session, otherCount = 0 }: DeviceLogOutButtonProps) {
  async function logOut() {
    const result = session
      ? await logOutDeviceAction(session.id)
      : await logOutOtherDevicesAction();
    if (!result.ok) {
      toast.error(result.message);
      return false;
    }
    toast.success(session ? `Logged out of ${session.name}` : "Logged out of all other devices");
  }

  return (
    <ConfirmDialog
      trigger={
        <Button variant={session ? "secondary" : "destructive"} size="sm">
          <LogOut aria-hidden />
          {session ? "Log out" : "Log out of all other devices"}
        </Button>
      }
      title={session ? `Log out of ${session.name}?` : "Log out of all other devices?"}
      description={
        session
          ? "That device will need your mobile number and a new code to log in again."
          : `${otherCount} ${otherCount === 1 ? "device" : "devices"} will need your mobile number and a new code to log in again. You stay logged in here.`
      }
      confirmLabel="Log out"
      tone="destructive"
      onConfirm={logOut}
    />
  );
}
