export type Address = {
  id: string;
  label: string;
  name: string;
  mobile: string;
  pin: string;
  /** House, building and street. */
  line1: string;
  area: string;
  city: string;
  state: string;
  isDefault: boolean;
};
