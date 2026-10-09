import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

type StarRatingInputProps = {
  name: string;
  value: number;
  onChange: (value: number) => void;
  invalid?: boolean;
};

const labels = ["Poor", "Fair", "Good", "Very good", "Excellent"];

/** Five radio buttons drawn as stars; arrow keys move between them like any radio group. */
export function StarRatingInput({ name, value, onChange, invalid }: StarRatingInputProps) {
  return (
    <div className="flex items-center gap-1" aria-invalid={invalid}>
      {labels.map((label, index) => {
        const rating = index + 1;
        return (
          <label
            key={label}
            className="flex size-11 cursor-pointer items-center justify-center rounded-lg has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50"
          >
            <input
              type="radio"
              name={name}
              value={rating}
              checked={value === rating}
              onChange={() => onChange(rating)}
              className="sr-only"
            />
            <Star
              className={cn(
                "size-8",
                rating <= value ? "fill-warning-500 text-warning-500" : "text-gray-300",
              )}
              aria-hidden
            />
            <span className="sr-only">
              {rating} {rating === 1 ? "star" : "stars"}, {label}
            </span>
          </label>
        );
      })}
      {value > 0 && (
        <span className="ml-2 text-sm font-medium text-gray-700">{labels[value - 1]}</span>
      )}
    </div>
  );
}
