import Link from "next/link";

import { accountNav } from "@/lib/navigation";
import { cn } from "@/lib/utils";

/** The account sidebar links. `activeHref` highlights the current page. */
export function AccountNavList({ activeHref }: { activeHref?: string }) {
  return (
    <ul className="sticky top-24 grid gap-1 rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
      {accountNav.map(({ label, href, icon: Icon }) => {
        const isActive = href === activeHref;
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex h-11 items-center gap-3 rounded-lg px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                isActive
                  ? "bg-navy-50 font-semibold text-navy-800"
                  : "font-medium text-gray-700 hover:bg-gray-100",
              )}
            >
              <Icon className="size-5" aria-hidden />
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
