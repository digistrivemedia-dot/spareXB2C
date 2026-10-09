import Link from "next/link";

import { cn } from "@/lib/utils";

type TabLinksProps = {
  label: string;
  tabs: { href: string; label: string; isActive: boolean }[];
};

/** Tabs that are links, so the chosen tab lives in the URL. Looks like the Tabs component. */
export function TabLinks({ label, tabs }: TabLinksProps) {
  return (
    <nav aria-label={label} className="flex w-full overflow-x-auto border-b border-gray-200">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          scroll={false}
          aria-current={tab.isActive ? "page" : undefined}
          className={cn(
            "relative flex h-12 shrink-0 items-center px-4 text-sm font-semibold whitespace-nowrap outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:text-base",
            "after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-navy-700",
            tab.isActive ? "text-navy-800" : "text-gray-600 after:opacity-0 hover:text-gray-900",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
