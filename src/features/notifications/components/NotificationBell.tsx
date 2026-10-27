"use client";

import { Bell, BellOff } from "lucide-react";
import Link from "next/link";

import { HeaderAction } from "@/components/layout/HeaderAction";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Notification } from "@/features/notifications/types";
import { cn } from "@/lib/utils";

/** The header bell: a count of things to do, and the list one tap away. */
export function NotificationBell({ notifications }: { notifications: Notification[] }) {
  const actionCount = notifications.filter((n) => n.needsAction).length;
  const label =
    actionCount > 0
      ? `Notifications, ${actionCount} need${actionCount === 1 ? "s" : ""} you`
      : "Notifications";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <HeaderAction aria-label={label} className="px-2">
          <span className="relative">
            <Bell className="size-6" aria-hidden />
            {actionCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-700 px-1 text-xs font-semibold text-white tabular-nums ring-2 ring-navy-900">
                {actionCount}
              </span>
            )}
          </span>
        </HeaderAction>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-w-[calc(100vw-2rem)]">
        <DropdownMenuLabel className="font-semibold text-gray-900">Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} asChild className="items-start py-2.5">
              <Link href={notification.href}>
                <span
                  className={cn(
                    "mt-1.5 size-2 shrink-0 rounded-full",
                    notification.needsAction ? "bg-orange-600" : "bg-navy-600",
                  )}
                  aria-hidden
                />
                <span className="min-w-0">
                  <span className="block font-semibold text-gray-900">{notification.title}</span>
                  <span className="block text-xs text-gray-500">{notification.detail}</span>
                </span>
              </Link>
            </DropdownMenuItem>
          ))
        ) : (
          <p className="flex items-center gap-2 px-2 py-4 text-sm text-gray-600">
            <BellOff className="size-4 text-gray-400" aria-hidden />
            You&apos;re all caught up.
          </p>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
