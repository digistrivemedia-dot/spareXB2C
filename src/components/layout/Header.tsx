import { Suspense } from "react";

import { Container } from "@/components/layout/Container";
import { HeaderAccount } from "@/components/layout/HeaderAccount";
import { HeaderLocation } from "@/components/layout/HeaderLocation";
import { HeaderNotifications } from "@/components/layout/HeaderNotifications";
import { HeaderSearch } from "@/components/layout/HeaderSearch";
import { HeaderSkeleton } from "@/components/layout/HeaderSkeleton";
import { HeaderVehicle } from "@/components/layout/HeaderVehicle";
import { Logo } from "@/components/layout/Logo";
import { CartLink } from "@/features/cart/components/CartLink";

/**
 * Mobile: logo, vehicle, cart and account on the first row; search below.
 * Desktop: one row with location, then a wide search in the middle.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-navy-900 shadow-sm print:hidden">
      <Container className="flex flex-wrap items-center gap-x-1 gap-y-3 py-3 lg:flex-nowrap lg:gap-x-3">
        <Logo />
        <Suspense fallback={<HeaderSkeleton className="hidden w-36 xl:block" />}>
          <HeaderLocation />
        </Suspense>
        <div className="order-last flex w-full min-w-0 gap-2 lg:order-none lg:flex-1">
          <HeaderSearch className="min-w-0 flex-1" />
        </div>
        {/* flex-1 + min-w-0: the actions shrink (the vehicle name truncates) instead of wrapping the row. */}
        <div className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-1 lg:ml-0 lg:flex-none">
          <Suspense fallback={<HeaderSkeleton className="w-28 lg:w-44" />}>
            <HeaderVehicle />
          </Suspense>
          <Suspense fallback={null}>
            <HeaderNotifications />
          </Suspense>
          <CartLink />
          <Suspense fallback={<HeaderSkeleton className="w-11" />}>
            <HeaderAccount />
          </Suspense>
        </div>
      </Container>
    </header>
  );
}
