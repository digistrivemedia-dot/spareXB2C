"use client";

import { usePathname } from "next/navigation";

import { AccountNavList } from "@/components/layout/AccountNavList";
import { accountNav, getActiveHref } from "@/lib/navigation";

export function ActiveAccountNavList() {
  return <AccountNavList activeHref={getActiveHref(usePathname(), accountNav)} />;
}
