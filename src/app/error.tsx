"use client";

import { ErrorState } from "@/components/ui/ErrorState";

export default function RootError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <main className="flex min-h-dvh items-center justify-center">
      <ErrorState onRetry={retry} titleAs="h1" />
    </main>
  );
}
