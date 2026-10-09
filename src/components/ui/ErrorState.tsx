import { TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";

/** Shown by error boundaries: what happened and a way to retry. */
type ErrorStateProps = {
  onRetry: () => void;
  /** Heading level: "h1" for a whole page, "h3" inside a titled section. */
  titleAs?: "h1" | "h2" | "h3";
};

export function ErrorState({ onRetry, titleAs = "h2" }: ErrorStateProps) {
  return (
    <EmptyState
      icon={TriangleAlert}
      titleAs={titleAs}
      title="Something went wrong"
      description="We couldn't load this. Please check your connection and try again."
    >
      <Button onClick={onRetry}>Try again</Button>
    </EmptyState>
  );
}
