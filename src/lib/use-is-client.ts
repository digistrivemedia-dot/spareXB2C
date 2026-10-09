import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** False during server rendering and hydration, true after. For output that depends on the browser, like today's date. */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
