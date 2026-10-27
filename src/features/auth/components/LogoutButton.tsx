"use client";

import { LogOut } from "lucide-react";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { logoutAction } from "@/features/auth/actions";

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      variant="secondary"
      disabled={isPending}
      onClick={() => startTransition(() => logoutAction())}
    >
      <LogOut aria-hidden />
      {isPending ? "Logging out…" : "Log out"}
    </Button>
  );
}
