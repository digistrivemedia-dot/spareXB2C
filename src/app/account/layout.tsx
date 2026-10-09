import { Suspense } from "react";

import { AccountSidebar } from "@/components/layout/AccountSidebar";
import { Container } from "@/components/layout/Container";
import { SiteShell } from "@/components/layout/SiteShell";
import { Skeleton } from "@/components/ui/skeleton";
import { SessionGate } from "@/features/auth/components/SessionGate";

/** Signed-in area: sidebar on desktop, the bottom nav does the job on mobile. */
export default function AccountLayout({ children }: LayoutProps<"/account">) {
  return (
    <SiteShell>
      <Container className="flex gap-8 py-6 lg:py-8">
        <AccountSidebar className="hidden w-60 shrink-0 lg:block" />
        <div className="min-w-0 flex-1">
          <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
            <SessionGate>{children}</SessionGate>
          </Suspense>
        </div>
      </Container>
    </SiteShell>
  );
}
