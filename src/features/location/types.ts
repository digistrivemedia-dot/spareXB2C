/** A delivery PIN code and the place it belongs to. */
export type PinLocation = {
  pin: string;
  area: string;
  city: string;
  state: string;
  isServiceable: boolean;
  /** Working days from order to doorstep; null when we don't deliver there. */
  deliveryDays: number | null;
};
