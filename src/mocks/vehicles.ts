import type {
  AddVehicleInput,
  DocumentStatus,
  MyVehicle,
  UpdateVehicleInput,
  VehicleBrand,
  VehicleCatalog,
  VehicleDocument,
  VehicleModel,
} from "@/features/vehicles/types";
import { toIndianIsoDate } from "@/lib/format";

const brands: VehicleBrand[] = [
  { id: "hero", name: "Hero" },
  { id: "honda", name: "Honda" },
  { id: "bajaj", name: "Bajaj" },
  { id: "tvs", name: "TVS" },
  { id: "royal-enfield", name: "Royal Enfield" },
  { id: "ktm", name: "KTM" },
  { id: "yamaha", name: "Yamaha" },
  { id: "suzuki", name: "Suzuki" },
  { id: "maruti-suzuki", name: "Maruti Suzuki" },
  { id: "hyundai", name: "Hyundai" },
  { id: "tata", name: "Tata" },
  { id: "mahindra", name: "Mahindra" },
  { id: "toyota", name: "Toyota" },
  { id: "ashok-leyland", name: "Ashok Leyland" },
  { id: "piaggio", name: "Piaggio" },
];

const recentYears = [2025, 2024, 2023, 2022];

function model(
  id: string,
  brandId: string,
  name: string,
  type: VehicleModel["type"],
  variantNames: string[],
  years: number[] = recentYears,
): VehicleModel {
  const variants = variantNames.map((variantName) => ({
    id: `${id}-${variantName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    name: variantName,
  }));
  return { id, brandId, name, type, variants, years };
}

const vehicleModels: VehicleModel[] = [
  model("hero-splendor-plus", "hero", "Splendor Plus", "bike", ["Self Alloy", "i3S"]),
  model("hero-hf-deluxe", "hero", "HF Deluxe", "bike", ["Kick Drum", "Self Alloy"]),
  model(
    "honda-activa-6g",
    "honda",
    "Activa 6G",
    "scooter",
    ["STD", "DLX"],
    [2024, 2023, 2022, 2021],
  ),
  model("honda-shine-125", "honda", "Shine 125", "bike", ["Drum", "Disc"]),
  model("honda-unicorn", "honda", "Unicorn", "bike", ["STD"]),
  model("bajaj-pulsar-150", "bajaj", "Pulsar 150", "bike", ["Single Disc", "Twin Disc"]),
  model("bajaj-pulsar-ns200", "bajaj", "Pulsar NS200", "bike", ["STD", "Dual Channel ABS"]),
  model("bajaj-platina", "bajaj", "Platina", "bike", ["100 ES", "110 ABS"]),
  model("tvs-apache-rtr-160-4v", "tvs", "Apache RTR 160 4V", "bike", ["Drum", "Disc"]),
  model("tvs-jupiter", "tvs", "Jupiter", "scooter", ["Drum", "Disc SmartXonnect"]),
  model("tvs-ntorq-125", "tvs", "Ntorq 125", "scooter", ["Disc", "Race Edition"]),
  model("royal-enfield-classic-350", "royal-enfield", "Classic 350", "bike", [
    "Single Channel",
    "Dual Channel",
  ]),
  model("royal-enfield-bullet-350", "royal-enfield", "Bullet 350", "bike", [
    "Military",
    "Standard",
  ]),
  model("royal-enfield-hunter-350", "royal-enfield", "Hunter 350", "bike", ["Retro", "Metro"]),
  model("ktm-duke-200", "ktm", "Duke 200", "bike", ["STD"]),
  model("ktm-duke-390", "ktm", "Duke 390", "bike", ["STD"]),
  model("ktm-rc-200", "ktm", "RC 200", "bike", ["STD", "GP Edition"]),
  model("yamaha-fz-s", "yamaha", "FZ-S", "bike", ["FI V4 STD", "FI V4 DLX"]),
  model("yamaha-r15-v4", "yamaha", "R15 V4", "bike", ["STD", "M"]),
  model("yamaha-fascino", "yamaha", "Fascino", "scooter", ["125 Drum", "125 Disc"]),
  model("suzuki-access-125", "suzuki", "Access 125", "scooter", ["Drum", "Disc"]),
  model("suzuki-gixxer", "suzuki", "Gixxer", "bike", ["STD", "Dual Tone"]),

  model("maruti-swift", "maruti-suzuki", "Swift", "car", ["LXi", "VXi", "ZXi"]),
  model("maruti-baleno", "maruti-suzuki", "Baleno", "car", ["Delta", "Zeta"]),
  model("maruti-wagon-r", "maruti-suzuki", "Wagon R", "car", ["LXi", "VXi CNG"]),
  model("hyundai-i20", "hyundai", "i20", "car", ["Magna", "Sportz"]),
  model("hyundai-creta", "hyundai", "Creta", "car", ["E", "SX"]),
  model("tata-nexon", "tata", "Nexon", "car", ["Smart", "Creative"]),
  model("tata-punch", "tata", "Punch", "car", ["Pure", "Adventure"]),
  model("mahindra-scorpio-n", "mahindra", "Scorpio-N", "car", ["Z4", "Z8"]),
  model("honda-city", "honda", "City", "car", ["V", "VX"]),
  model("toyota-innova-crysta", "toyota", "Innova Crysta", "car", ["GX", "VX"]),

  model("tata-ace-gold", "tata", "Ace Gold", "commercial", ["Petrol", "Diesel"]),
  model("tata-intra-v30", "tata", "Intra V30", "commercial", ["STD"]),
  model("mahindra-bolero-pik-up", "mahindra", "Bolero Pik-Up", "commercial", ["1.3 T", "1.7 T"]),
  model("ashok-leyland-dost-plus", "ashok-leyland", "Dost+", "commercial", ["LS", "XL"]),
  model("bajaj-re-compact", "bajaj", "RE Compact", "commercial", ["CNG", "LPG"]),
  model("piaggio-ape-city", "piaggio", "Ape City", "commercial", ["Plus", "Xtra"]),
];

export const vehicleCatalog: VehicleCatalog = { brands, models: vehicleModels };

function document(
  kind: VehicleDocument["kind"],
  details: Partial<Omit<VehicleDocument, "kind">> = {},
): VehicleDocument {
  return {
    kind,
    number: null,
    provider: null,
    expiresOn: null,
    status: "missing",
    photo: null,
    ...details,
  };
}

const myVehicles: MyVehicle[] = [
  {
    id: "vehicle-ktm-duke-200",
    modelId: "ktm-duke-200",
    variantId: "ktm-duke-200-std",
    year: 2023,
    brandName: "KTM",
    modelName: "Duke 200",
    variantName: "STD",
    type: "bike",
    registrationNumber: "KA03MX4521",
    odometerKm: 18420,
    odometerUpdatedAt: "2026-10-02T09:30:00+05:30",
    photos: [{ url: "/images/vehicles/ktm-duke-200.jpg", alt: "KTM Duke 200, side view" }],
    documents: [
      document("insurance", {
        number: "3005/27931454/10/000",
        provider: "ICICI Lombard",
        expiresOn: "2026-12-15",
        status: "ok",
      }),
      document("puc", { number: "KA0300910452", expiresOn: "2026-11-05", status: "due-soon" }),
      document("rc", { expiresOn: "2038-03-14", status: "ok" }),
    ],
    isDefault: true,
  },
  {
    id: "vehicle-honda-activa-6g",
    modelId: "honda-activa-6g",
    variantId: "honda-activa-6g-dlx",
    year: 2021,
    brandName: "Honda",
    modelName: "Activa 6G",
    variantName: "DLX",
    type: "scooter",
    registrationNumber: "KA53HE7782",
    odometerKm: 22150,
    odometerUpdatedAt: "2026-09-18T18:10:00+05:30",
    photos: [{ url: "/images/vehicles/honda-activa-6g.jpg", alt: "Honda Activa 6G, parked" }],
    documents: [
      document("insurance", {
        number: "OG-22-1901-1801-00004412",
        provider: "Bajaj Allianz",
        expiresOn: "2026-09-30",
        status: "overdue",
      }),
      document("puc", { number: "KA5300228815", expiresOn: "2027-01-12", status: "ok" }),
      document("rc", { expiresOn: "2036-07-21", status: "ok" }),
    ],
    isDefault: false,
  },
  {
    id: "vehicle-maruti-swift",
    modelId: "maruti-swift",
    variantId: "maruti-swift-vxi",
    year: 2022,
    brandName: "Maruti Suzuki",
    modelName: "Swift",
    variantName: "VXi",
    type: "car",
    registrationNumber: "KA05NG2231",
    odometerKm: 31260,
    odometerUpdatedAt: "2026-10-12T11:00:00+05:30",
    photos: [],
    documents: [
      document("insurance", {
        number: "P0022100003/4103/100512",
        provider: "Tata AIG",
        expiresOn: "2027-04-02",
        status: "ok",
      }),
      document("puc"),
      document("rc", { expiresOn: "2037-04-01", status: "ok" }),
    ],
    isDefault: false,
  },
];

const DUE_SOON_DAYS = 30;

/** Status from the expiry date; the real backend decides this (rules in decision.md, C3). */
function documentStatus(expiresOn: string | null): DocumentStatus {
  if (!expiresOn) return "missing";
  const today = toIndianIsoDate(new Date());
  if (expiresOn < today) return "overdue";
  const soon = toIndianIsoDate(new Date(Date.now() + DUE_SOON_DAYS * 86_400_000));
  return expiresOn <= soon ? "due-soon" : "ok";
}

const find = (id: string) => myVehicles.find((vehicle) => vehicle.id === id);

// Demo data lives in memory, so new vehicles and changes last until the server restarts.
export const mockVehicles = {
  async getVehicleCatalog(): Promise<VehicleCatalog> {
    return vehicleCatalog;
  },

  async getMyVehicles(): Promise<MyVehicle[]> {
    return [...myVehicles].sort((a, b) => Number(b.isDefault) - Number(a.isDefault));
  },

  async getMyVehicle(id: string): Promise<MyVehicle | null> {
    return find(id) ?? null;
  },

  async addMyVehicle(input: AddVehicleInput): Promise<MyVehicle> {
    const vehicle: MyVehicle = {
      ...input,
      id: `vehicle-${input.modelId}-${Date.now()}`,
      odometerUpdatedAt: new Date().toISOString(),
      photos: [],
      documents: [document("insurance"), document("puc"), document("rc")],
      isDefault: myVehicles.length === 0,
    };
    myVehicles.push(vehicle);
    return vehicle;
  },

  async updateMyVehicle(id: string, input: UpdateVehicleInput): Promise<MyVehicle | null> {
    const vehicle = find(id);
    if (!vehicle) return null;
    Object.assign(vehicle, {
      registrationNumber: input.registrationNumber,
      photos: input.photos,
      documents: input.documents.map((d) => ({ ...d, status: documentStatus(d.expiresOn) })),
    });
    return vehicle;
  },

  async updateOdometer(id: string, odometerKm: number): Promise<MyVehicle | null> {
    const vehicle = find(id);
    if (!vehicle) return null;
    Object.assign(vehicle, { odometerKm, odometerUpdatedAt: new Date().toISOString() });
    return vehicle;
  },

  async setDefaultVehicle(id: string): Promise<void> {
    if (!find(id)) return;
    myVehicles.forEach((vehicle) => (vehicle.isDefault = vehicle.id === id));
  },

  async removeMyVehicle(id: string): Promise<void> {
    const index = myVehicles.findIndex((vehicle) => vehicle.id === id);
    if (index === -1) return;
    const [removed] = myVehicles.splice(index, 1);
    if (removed.isDefault && myVehicles.length > 0) myVehicles[0].isDefault = true;
  },
};
