import { useEffect, useEffectEvent, useState } from "react";

type Result<T> = { key: string; attempt: number; data?: T };

export type DataState<T> =
  | { status: "idle" | "loading" | "error"; data?: undefined; retry: () => void }
  | { status: "success"; data: T; retry: () => void };

/**
 * Loads data that depends on something only the browser knows (a choice in a wizard, the selected
 * vehicle). `key` names what is loaded; a new key loads again, null skips loading.
 * Server components call the feature's api.ts directly instead.
 */
export function useData<T>(key: string | null, load: () => Promise<T>): DataState<T> {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<Result<T> | null>(null);
  // `key` stands for everything `load` reads, so only a new key (or a retry) loads again.
  const run = useEffectEvent(load);

  useEffect(() => {
    if (key === null) return;
    let isCurrent = true;
    run().then(
      (data) => isCurrent && setResult({ key, attempt, data }),
      () => isCurrent && setResult({ key, attempt }),
    );
    return () => {
      isCurrent = false;
    };
  }, [key, attempt]);

  const retry = () => setAttempt((n) => n + 1);

  if (key === null) return { status: "idle", retry };
  if (result?.key !== key || result.attempt !== attempt) return { status: "loading", retry };
  if (result.data !== undefined) return { status: "success", data: result.data, retry };
  return { status: "error", retry };
}
