import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

type QuantityStepperProps = {
  value: number;
  max: number;
  onChange: (value: number) => void;
  /** What is being counted, for screen readers, e.g. the product name. */
  label: string;
};

const buttonClass =
  "flex size-11 items-center justify-center text-gray-700 outline-none hover:bg-gray-100 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40 md:size-10";

/** − 2 + control, from 1 up to `max`. */
export function QuantityStepper({ value, max, onChange, label }: QuantityStepperProps) {
  return (
    <div className="inline-flex items-center rounded-lg border border-gray-300 bg-white">
      <button
        type="button"
        className={cn(buttonClass, "rounded-l-lg")}
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label={`Decrease quantity of ${label}`}
      >
        <Minus className="size-4" aria-hidden />
      </button>
      <output
        aria-live="polite"
        aria-label={`Quantity of ${label}`}
        className="w-10 text-center font-semibold text-gray-900 tabular-nums"
      >
        {value}
      </output>
      <button
        type="button"
        className={cn(buttonClass, "rounded-r-lg")}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={`Increase quantity of ${label}`}
      >
        <Plus className="size-4" aria-hidden />
      </button>
    </div>
  );
}
