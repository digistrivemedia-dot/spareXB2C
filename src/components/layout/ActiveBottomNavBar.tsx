"use client";

import { usePathname } from "next/navigation";

import { BottomNavBar } from "@/components/layout/BottomNavBar";
import { getActiveHref, mobileNav } from "@/lib/navigation";

export function ActiveBottomNavBar() {
  return <BottomNavBar activeHref={getActiveHref(usePathname(), mobileNav)} />;
}
