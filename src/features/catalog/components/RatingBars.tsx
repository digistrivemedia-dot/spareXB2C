import { Star } from "lucide-react";

import type { RatingBreakdown } from "@/features/catalog/types";

const countFormat = new Intl.NumberFormat("en-IN");

/** Average rating with a bar per star level. */
export function RatingBars({ breakdown }: { breakdown: RatingBreakdown }) {
  const levels = [5, 4, 3, 2, 1];

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
      <div className="text-center sm:w-32">
        <p className="text-4xl font-semibold text-gray-900 tabular-nums">
          {breakdown.average.toFixed(1)}
        </p>
        <p className="mt-1 flex items-center justify-center gap-0.5" aria-hidden>
          {levels.map((level) => (
            <Star
              key={level}
              className={
                6 - level <= Math.round(breakdown.average)
                  ? "size-4 fill-warning-500 text-warning-500"
                  : "size-4 text-gray-300"
              }
            />
          ))}
        </p>
        <p className="mt-1 text-sm text-gray-600">
          {countFormat.format(breakdown.count)} ratings
          <span className="sr-only">, average {breakdown.average.toFixed(1)} out of 5</span>
        </p>
      </div>
      <ul className="grid flex-1 gap-2" aria-label="Ratings by star">
        {levels.map((level) => {
          const count = breakdown.distribution[level - 1];
          const share = breakdown.count > 0 ? Math.round((count / breakdown.count) * 100) : 0;
          return (
            <li key={level} className="flex items-center gap-3 text-sm">
              <span className="w-8 text-gray-700 tabular-nums">{level}★</span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                {/* The bar width is data, so it's passed as a CSS variable. */}
                <span
                  className="block h-full w-(--share) rounded-full bg-warning-500"
                  style={{ "--share": `${share}%` } as React.CSSProperties}
                />
              </span>
              <span className="w-14 text-right text-gray-600 tabular-nums">
                {countFormat.format(count)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
