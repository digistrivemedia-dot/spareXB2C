// Delivery dates are counted in India Standard Time. Shifting by the offset lets the UTC date
// functions below read the Indian calendar date, whatever the browser's time zone is.
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

/** The date an order placed now arrives, counting working days (couriers don't deliver on Sundays). */
export function getDeliveryDate(now: Date, workingDays: number): Date {
  const date = new Date(now.getTime() + IST_OFFSET_MS);
  let added = 0;
  while (added < workingDays) {
    date.setUTCDate(date.getUTCDate() + 1);
    if (date.getUTCDay() !== 0) added += 1;
  }
  return new Date(date.getTime() - IST_OFFSET_MS);
}
