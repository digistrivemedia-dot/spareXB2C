"use client";

import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { listBookableDatesAction } from "@/features/service/actions";
import { DateOptions } from "@/features/service/components/DateOptions";
import { useData } from "@/lib/use-data";

type DateStepProps = {
  /** Null when Kannali assigns the garage: any day some garage is open. */
  garageId: string | null;
  selected: string;
  onSelect: (date: string) => void;
};

/** Loads the days open for booking, and lets the customer pick one. */
export function DateStep({ garageId, selected, onSelect }: DateStepProps) {
  const dates = useData(garageId ?? "any-garage", () => listBookableDatesAction(garageId));

  if (dates.status === "error") return <ErrorState onRetry={dates.retry} titleAs="h3" />;
  if (dates.status !== "success") {
    return (
      <div
        className="grid grid-cols-2 gap-2 sm:grid-cols-4"
        aria-busy="true"
        aria-label="Loading days"
      >
        {Array.from({ length: 8 }, (_, index) => (
          <Skeleton key={index} className="h-14 rounded-xl" />
        ))}
      </div>
    );
  }
  return <DateOptions dates={dates.data} selected={selected} onSelect={onSelect} />;
}
