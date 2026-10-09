import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

type RatingProps = {
  average: number;
  count: number;
  className?: string;
};

const countFormat = new Intl.NumberFormat("en-IN");

export function Rating({ average, count, className }: RatingProps) {
  return (
    <p className={cn("flex items-center gap-1 text-sm", className)}>
      <Star className="size-4 fill-warning-500 text-warning-500" aria-hidden />
      <span className="font-semibold text-gray-900 tabular-nums">{average.toFixed(1)}</span>
      <span className="text-gray-500 tabular-nums">({countFormat.format(count)})</span>
      <span className="sr-only">out of 5, from {countFormat.format(count)} ratings</span>
    </p>
  );
}
