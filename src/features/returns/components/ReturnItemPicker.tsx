"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { ProductImage } from "@/features/catalog/components/ProductImage";
import type { OrderItem } from "@/features/orders/types";
import { formatPrice } from "@/lib/format";

type ReturnItemPickerProps = {
  items: OrderItem[];
  /** How many of each item can still be returned. */
  returnable: Record<string, number>;
  quantities: Record<string, number>;
  onChange: (quantities: Record<string, number>) => void;
};

/** A tick per part, and how many units when more than one was bought. */
export function ReturnItemPicker({
  items,
  returnable,
  quantities,
  onChange,
}: ReturnItemPickerProps) {
  const set = (itemId: string, quantity: number) => onChange({ ...quantities, [itemId]: quantity });

  return (
    <ul className="divide-y divide-gray-200">
      {items.map((item) => {
        const max = returnable[item.id] ?? 0;
        const quantity = quantities[item.id] ?? 0;
        const id = `return-item-${item.id}`;
        return (
          <li key={item.id} className="flex flex-wrap items-center gap-3 py-3 first:pt-0 last:pb-0">
            <Checkbox
              id={id}
              checked={quantity > 0}
              disabled={max === 0}
              // Ticking returns every unit still returnable; the stepper can lower it.
              onCheckedChange={(state) => set(item.id, state === true ? max : 0)}
            />
            <label htmlFor={id} className="flex min-w-0 flex-1 cursor-pointer items-center gap-3">
              <ProductImage
                image={item.imageUrl ? { url: item.imageUrl, alt: item.name } : null}
                sizes="56px"
                className="w-14 shrink-0 border border-gray-200"
              />
              <span className="min-w-0 text-sm">
                <span className="line-clamp-2 font-medium text-gray-900">{item.name}</span>
                <span className="text-gray-600">
                  {formatPrice(item.unitPriceInPaise)} each
                  {max === 0 ? " · Already being returned" : ` · ${max} can be returned`}
                </span>
              </span>
            </label>
            {quantity > 0 && max > 1 && (
              <div className="w-full pl-7 sm:w-auto sm:pl-0">
                <QuantityStepper
                  value={quantity}
                  max={max}
                  onChange={(value) => set(item.id, value)}
                  label={item.name}
                />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
