import { Suspense } from "react";

import { ActiveModeSwitch } from "@/components/layout/ActiveModeSwitch";
import { ModeSwitch } from "@/components/layout/ModeSwitch";

/** Reading the URL makes the active mode dynamic, so Shop (the default) shows until it is known. */
export function HeaderModeSwitch({ className }: { className?: string }) {
  return (
    <Suspense fallback={<ModeSwitch className={className} />}>
      <ActiveModeSwitch className={className} />
    </Suspense>
  );
}
