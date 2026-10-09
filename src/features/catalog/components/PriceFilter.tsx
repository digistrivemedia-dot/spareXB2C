import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type PriceRangeValues, priceRangeSchema } from "@/features/catalog/schema";

type PriceFilterProps = {
  minPrice: number | undefined;
  maxPrice: number | undefined;
  onApply: (range: { minPrice?: number; maxPrice?: number }) => void;
};

/** Min and max price in rupees, applied together. */
export function PriceFilter({ minPrice, maxPrice, onApply }: PriceFilterProps) {
  const id = useId();
  const form = useForm<PriceRangeValues>({
    resolver: zodResolver(priceRangeSchema),
    defaultValues: { min: minPrice?.toString() ?? "", max: maxPrice?.toString() ?? "" },
  });
  const error = form.formState.errors.min ?? form.formState.errors.max;

  function onSubmit({ min, max }: PriceRangeValues) {
    onApply({ minPrice: min ? Number(min) : undefined, maxPrice: max ? Number(max) : undefined });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="grid gap-2">
      <div className="flex items-end gap-2">
        <div className="grid flex-1 gap-1">
          <Label htmlFor={`${id}-min`} className="text-xs font-normal text-gray-600">
            Min (₹)
          </Label>
          <Input
            id={`${id}-min`}
            inputMode="numeric"
            placeholder="0"
            aria-invalid={Boolean(error)}
            {...form.register("min")}
          />
        </div>
        <div className="grid flex-1 gap-1">
          <Label htmlFor={`${id}-max`} className="text-xs font-normal text-gray-600">
            Max (₹)
          </Label>
          <Input
            id={`${id}-max`}
            inputMode="numeric"
            placeholder="Any"
            aria-invalid={Boolean(error)}
            {...form.register("max")}
          />
        </div>
        <Button type="submit" variant="secondary">
          Go
        </Button>
      </div>
      <FieldError errors={[error]} />
    </form>
  );
}
