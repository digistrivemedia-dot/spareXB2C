"use client";

import { Headset, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Link from "next/link";

import { useSidebarStore } from "@/components/layout/sidebar-store";
import { SUPPORT_PHONE } from "@/lib/constants";
import { formatMobile } from "@/lib/format";
import { accountNavSections } from "@/lib/navigation";
import { cn } from "@/lib/utils";

const rowClass =
  "relative flex h-9 w-full items-center gap-3 rounded-lg px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

/**
 * The account links in groups, the current page in navy with an orange bar. Collapses to icons only;
 * the names then show on hover.
 */
export function AccountNavList({ activeHref }: { activeHref?: string }) {
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);
  const toggle = useSidebarStore((state) => state.toggle);
  const collapsedRow = isCollapsed && "justify-center px-0";

  return (
    <div
      className={cn(
        "sticky top-21 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-2 shadow-sm transition-[width]",
        isCollapsed ? "w-14" : "w-56",
      )}
    >
      {accountNavSections.map((section, index) => (
        <div key={section.title ?? index} className="grid gap-0.5">
          {section.title &&
            (isCollapsed ? (
              <hr className="mx-2 mb-1 border-gray-200" />
            ) : (
              <p className="px-3 pb-1 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                {section.title}
              </p>
            ))}
          {section.items.map(({ label, href, icon: Icon }) => {
            const isActive = href === activeHref;
            return (
              <Link
                key={href}
                href={href}
                title={isCollapsed ? label : undefined}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  rowClass,
                  collapsedRow,
                  isActive
                    ? "bg-navy-50 font-semibold text-navy-900 before:absolute before:inset-y-1.5 before:left-0 before:w-1 before:rounded-full before:bg-orange-600"
                    : "font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                )}
              >
                <Icon
                  className={cn("size-5 shrink-0", isActive ? "text-navy-700" : "text-gray-500")}
                  aria-hidden
                />
                <span className={cn(isCollapsed && "sr-only")}>{label}</span>
              </Link>
            );
          })}
        </div>
      ))}

      <div className="grid gap-0.5 border-t border-gray-200 pt-2">
        <a
          href={`tel:+91${SUPPORT_PHONE}`}
          title={`Call support · ${formatMobile(SUPPORT_PHONE)}`}
          className={cn(rowClass, collapsedRow, "font-medium text-gray-700 hover:bg-gray-50")}
        >
          <Headset className="size-5 shrink-0 text-gray-500" aria-hidden />
          <span className={cn(isCollapsed && "sr-only")}>Call support</span>
        </a>
        <button
          type="button"
          onClick={toggle}
          aria-expanded={!isCollapsed}
          title={isCollapsed ? "Expand menu" : undefined}
          className={cn(
            rowClass,
            collapsedRow,
            "font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900",
          )}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="size-5 shrink-0" aria-hidden />
          ) : (
            <PanelLeftClose className="size-5 shrink-0" aria-hidden />
          )}
          <span className={cn(isCollapsed && "sr-only")}>
            {isCollapsed ? "Expand menu" : "Collapse menu"}
          </span>
        </button>
      </div>
    </div>
  );
}
