"use client";

import { usePathname } from "next/navigation";

import { ModeSwitch } from "@/components/layout/ModeSwitch";
import { getActiveHref, modeNav } from "@/lib/navigation";

export function ActiveModeSwitch({ className }: { className?: string }) {
  return <ModeSwitch activeHref={getActiveHref(usePathname(), modeNav)} className={className} />;
}
