import { Suspense } from "react";

import { ActiveBottomNavBar } from "@/components/layout/ActiveBottomNavBar";
import { BottomNavBar } from "@/components/layout/BottomNavBar";

/** Reading the URL makes the active state dynamic, so the plain bar is shown until it is known. */
export function MobileBottomNav() {
  return (
    <Suspense fallback={<BottomNavBar />}>
      <ActiveBottomNavBar />
    </Suspense>
  );
}
