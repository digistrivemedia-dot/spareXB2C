import { Suspense } from "react";

import { AccountNavList } from "@/components/layout/AccountNavList";
import { ActiveAccountNavList } from "@/components/layout/ActiveAccountNavList";
import { cn } from "@/lib/utils";

/**
 * Sits beside the page and stays in view while it scrolls, ending where the page ends (never beside the footer).
 * Reading the URL makes the active state dynamic, so the plain list is shown until it is known.
 */
export function AccountSidebar({ className }: { className?: string }) {
  return (
    <aside aria-label="Account" className={cn(className, "print:hidden")}>
      <Suspense fallback={<AccountNavList />}>
        <ActiveAccountNavList />
      </Suspense>
    </aside>
  );
}
