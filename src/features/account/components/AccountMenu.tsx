"use client";

import { ChevronDown, LogOut } from "lucide-react";
import Link from "next/link";
import { startTransition } from "react";

import { HeaderAction } from "@/components/layout/HeaderAction";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/features/auth/actions";
import type { User } from "@/features/auth/types";
import { formatMobile } from "@/lib/format";
import { accountNav } from "@/lib/navigation";

type AccountMenuProps = {
  user: User;
};

export function AccountMenu({ user }: AccountMenuProps) {
  const firstName = user.name.split(" ")[0];
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <HeaderAction aria-label="Your account" className="px-1.5 lg:px-2.5">
          <span className="flex size-8 items-center justify-center rounded-full bg-navy-600 text-xs font-semibold">
            {initials}
          </span>
          <span className="hidden xl:inline">{firstName}</span>
          <ChevronDown className="hidden size-4 lg:block" aria-hidden />
        </HeaderAction>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="font-semibold text-gray-900">Hi, {firstName}</span>
          <span className="text-xs font-normal text-gray-500">{formatMobile(user.mobile)}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {accountNav.map(({ label, href, icon: Icon }) => (
          <DropdownMenuItem key={href} asChild>
            <Link href={href}>
              <Icon aria-hidden />
              {label}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => startTransition(() => logoutAction())}>
          <LogOut aria-hidden />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
