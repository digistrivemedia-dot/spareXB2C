import type { Address } from "@/features/account/types";

export const addresses: Address[] = [
  {
    id: "adr-home",
    label: "Home",
    name: "Arjun Rao",
    mobile: "9845012345",
    pin: "560066",
    line1: "Flat 304, Sai Krupa Residency, 4th Cross, ITPL Main Road",
    area: "Whitefield",
    city: "Bengaluru",
    state: "Karnataka",
    isDefault: true,
  },
  {
    id: "adr-work",
    label: "Work",
    name: "Arjun Rao",
    mobile: "9845012345",
    pin: "560037",
    line1: "3rd Floor, Orion Business Park, Outer Ring Road",
    area: "Marathahalli",
    city: "Bengaluru",
    state: "Karnataka",
    isDefault: false,
  },
];

export const mockAccount = {
  async getAddresses(): Promise<Address[]> {
    return addresses;
  },
};
