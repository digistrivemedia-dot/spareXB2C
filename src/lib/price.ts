/** Whole-number % off MRP, or 0 when there is no discount. */
export function getDiscountPercent(priceInPaise: number, mrpInPaise: number): number {
  return mrpInPaise > priceInPaise ? Math.round((1 - priceInPaise / mrpInPaise) * 100) : 0;
}
