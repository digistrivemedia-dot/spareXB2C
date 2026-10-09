import { BadgeCheck, Star } from "lucide-react";

import type { ProductReviews as ProductReviewsData } from "@/features/catalog/api";
import { RatingBars } from "@/features/catalog/components/RatingBars";
import { formatDate } from "@/lib/format";

export function ProductReviews({ data }: { data: ProductReviewsData }) {
  const reviews = data.reviews.items;

  return (
    <div className="grid gap-8">
      <RatingBars breakdown={data.breakdown} />

      {reviews.length > 0 ? (
        <ul className="grid gap-4">
          {reviews.map((review) => (
            <li key={review.id} className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="inline-flex items-center gap-1 rounded-full bg-success-700 px-2 py-0.5 text-xs font-semibold text-white">
                  {review.rating}
                  <Star className="size-3 fill-current" aria-hidden />
                  <span className="sr-only">out of 5</span>
                </span>
                <h3 className="font-semibold text-gray-900">{review.title}</h3>
              </div>
              <p className="mt-2 text-sm text-gray-700">{review.body}</p>
              <p className="mt-3 flex flex-wrap items-center gap-x-2 text-xs text-gray-500">
                {review.authorName} · {formatDate(review.createdAt)}
                {review.isVerifiedPurchase && (
                  <span className="inline-flex items-center gap-1 text-success-700">
                    <BadgeCheck className="size-3.5" aria-hidden />
                    Verified purchase
                  </span>
                )}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-600">
          No written reviews yet. Buyers have left star ratings only.
        </p>
      )}
    </div>
  );
}
