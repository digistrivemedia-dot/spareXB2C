import Link from "next/link";

import { mobileNav } from "@/lib/navigation";
import { cn } from "@/lib/utils";

/** The mobile bottom navigation. `activeHref` highlights the current section. */
export function BottomNavBar({ activeHref }: { activeHref?: string }) {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white lg:hidden print:hidden"
    >
      <ul className="grid grid-cols-5">
        {mobileNav.map(({ label, href, icon: Icon }) => {
          const isActive = href === activeHref;
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex h-16 flex-col items-center justify-center gap-1 text-xs font-medium outline-none focus-visible:bg-navy-50",
                  isActive ? "text-navy-700" : "text-gray-500 hover:text-gray-900",
                )}
              >
                <Icon className="size-5" strokeWidth={isActive ? 2.5 : 2} aria-hidden />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
