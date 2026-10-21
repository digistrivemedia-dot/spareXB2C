import Link from "next/link";

import { modeNav } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type ModeSwitchProps = {
  /** The current mode's href; Shop when the page isn't part of Service. */
  activeHref?: string;
  className?: string;
};

/** The header's Shop / Service switch. */
export function ModeSwitch({ activeHref = modeNav[0].href, className }: ModeSwitchProps) {
  return (
    <nav
      aria-label="Shop or service"
      className={cn("flex h-11 shrink-0 rounded-full bg-navy-900", className)}
    >
      {modeNav.map(({ label, href, icon: Icon }) => {
        const isActive = href === activeHref;
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 text-sm font-semibold transition-colors outline-none focus-visible:ring-3 focus-visible:ring-white/60 sm:px-4",
              isActive ? "bg-white text-navy-800" : "text-navy-100 hover:text-white",
            )}
          >
            <Icon className="hidden size-4 sm:block" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
