import type { PinLocation } from "@/features/location/types";

const bengaluru = {
  city: "Bengaluru",
  state: "Karnataka",
  isServiceable: true,
};

const pinLocations: PinLocation[] = [
  { pin: "560066", area: "Whitefield", ...bengaluru, deliveryDays: 2 },
  { pin: "560037", area: "Marathahalli", ...bengaluru, deliveryDays: 2 },
  { pin: "560103", area: "Bellandur", ...bengaluru, deliveryDays: 2 },
  { pin: "560048", area: "Mahadevapura", ...bengaluru, deliveryDays: 2 },
  { pin: "560038", area: "Indiranagar", ...bengaluru, deliveryDays: 2 },
  { pin: "560034", area: "Koramangala", ...bengaluru, deliveryDays: 2 },
  { pin: "560102", area: "HSR Layout", ...bengaluru, deliveryDays: 2 },
  { pin: "560076", area: "BTM Layout", ...bengaluru, deliveryDays: 2 },
  { pin: "560041", area: "Jayanagar", ...bengaluru, deliveryDays: 3 },
  { pin: "560100", area: "Electronic City", ...bengaluru, deliveryDays: 3 },
  { pin: "560024", area: "Hebbal", ...bengaluru, deliveryDays: 3 },
  { pin: "560001", area: "MG Road", ...bengaluru, deliveryDays: 2 },
  { pin: "562125", area: "Sarjapura", ...bengaluru, deliveryDays: 4 },
  {
    pin: "570001",
    area: "Mysuru",
    city: "Mysuru",
    state: "Karnataka",
    isServiceable: true,
    deliveryDays: 4,
  },
  {
    pin: "600001",
    area: "George Town",
    city: "Chennai",
    state: "Tamil Nadu",
    isServiceable: true,
    deliveryDays: 5,
  },
  {
    pin: "500001",
    area: "Abids",
    city: "Hyderabad",
    state: "Telangana",
    isServiceable: true,
    deliveryDays: 5,
  },
  {
    pin: "400001",
    area: "Fort",
    city: "Mumbai",
    state: "Maharashtra",
    isServiceable: false,
    deliveryDays: null,
  },
  {
    pin: "110001",
    area: "Connaught Place",
    city: "New Delhi",
    state: "Delhi",
    isServiceable: false,
    deliveryDays: null,
  },
];

export const mockLocation = {
  async lookupPin(pin: string): Promise<PinLocation | null> {
    return pinLocations.find((location) => location.pin === pin) ?? null;
  },
};
