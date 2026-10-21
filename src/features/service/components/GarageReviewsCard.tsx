import { Star } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Garage, GarageReviews } from "@/features/service/types";
import { formatDate } from "@/lib/format";

type GarageReviewsCardProps = {
  garage: Garage;
  reviews: GarageReviews;
};

const countFormat = new Intl.NumberFormat("en-IN");

/** The average, a bar per star level, and the latest comments from customers who visited. */
export function GarageReviewsCard({ garage, reviews }: GarageReviewsCardProps) {
  const total = reviews.distribution.reduce((sum, count) => sum + count, 0) || 1;

  return (
    <Card aria-labelledby="garage-reviews-heading" className="grid gap-5">
      <SectionHeader id="garage-reviews-heading" title="Ratings and reviews" />
      <div className="grid gap-5 sm:grid-cols-3 sm:items-center">
        <div className="text-center sm:text-left">
          <p className="text-4xl font-semibold text-gray-900 tabular-nums">
            {garage.rating.toFixed(1)}
          </p>
          <p className="text-sm text-gray-600">
            from {countFormat.format(garage.reviewCount)} ratings
          </p>
        </div>
        <ul aria-label="Ratings by stars" className="grid gap-1.5 sm:col-span-2">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = reviews.distribution[stars - 1];
            return (
              <li key={stars} className="flex items-center gap-2 text-sm">
                <span className="w-8 text-gray-700 tabular-nums">{stars} ★</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                  {/* The bar's length is the share of ratings at this level. */}
                  <span
                    className="block h-full w-(--share) rounded-full bg-warning-500"
                    style={{ "--share": `${(count / total) * 100}%` } as React.CSSProperties}
                  />
                </span>
                <span className="w-10 text-right text-gray-500 tabular-nums">{count}</span>
              </li>
            );
          })}
        </ul>
      </div>
      {reviews.latest.length > 0 && (
        <ul className="divide-y divide-gray-200 border-t border-gray-200">
          {reviews.latest.map((review) => (
            <li key={review.id} className="grid gap-1 py-4 text-sm last:pb-0">
              <p className="flex flex-wrap items-center gap-x-2 text-gray-900">
                <span className="inline-flex items-center gap-1 font-semibold">
                  <Star className="size-4 fill-warning-500 text-warning-500" aria-hidden />
                  {review.rating}
                  <span className="sr-only">out of 5</span>
                </span>
                <span className="font-medium">{review.authorName}</span>
                <span className="text-gray-500">
                  · {review.vehicleName} · {formatDate(review.createdAt)}
                </span>
              </p>
              <p className="text-gray-700">{review.comment}</p>
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs text-gray-500">
        Only customers who serviced their vehicle here can rate it.
      </p>
    </Card>
  );
}
