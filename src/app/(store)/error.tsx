"use client";

import { ErrorState } from "@/components/ui/ErrorState";

export default function StoreError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return <ErrorState onRetry={retry} titleAs="h1" />;
}
