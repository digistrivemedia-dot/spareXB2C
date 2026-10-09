import type {
  AddBikeInput,
  MyBike,
  VehicleBrand,
  VehicleCatalog,
  VehicleModel,
} from "@/features/vehicles/types";

const brands: VehicleBrand[] = [
  { id: "hero", name: "Hero" },
  { id: "honda", name: "Honda" },
  { id: "bajaj", name: "Bajaj" },
  { id: "tvs", name: "TVS" },
  { id: "royal-enfield", name: "Royal Enfield" },
  { id: "ktm", name: "KTM" },
  { id: "yamaha", name: "Yamaha" },
  { id: "suzuki", name: "Suzuki" },
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
];

export const vehicleCatalog: VehicleCatalog = { brands, models: vehicleModels };

const myBikes: MyBike[] = [
  {
    id: "bike-ktm-duke-200",
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
    imageUrl: "/images/bikes/ktm-duke-200.jpg",
    isDefault: true,
  },
  {
    id: "bike-honda-activa-6g",
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
    imageUrl: "/images/bikes/honda-activa-6g.jpg",
    isDefault: false,
  },
];

export const mockVehicles = {
  async getVehicleCatalog(): Promise<VehicleCatalog> {
    return vehicleCatalog;
  },

  async getMyBikes(): Promise<MyBike[]> {
    return myBikes;
  },

  async getMyBike(id: string): Promise<MyBike | null> {
    return myBikes.find((bike) => bike.id === id) ?? null;
  },

  // Demo data lives in memory, so new bikes and updates last until the server restarts.
  async addMyBike(input: AddBikeInput): Promise<MyBike> {
    const bike: MyBike = {
      ...input,
      id: `bike-${input.modelId}-${myBikes.length + 1}`,
      type: vehicleModels.find((m) => m.id === input.modelId)?.type ?? "bike",
      odometerUpdatedAt: new Date().toISOString(),
      imageUrl: null,
      isDefault: myBikes.length === 0,
    };
    myBikes.push(bike);
    return bike;
  },

  async updateOdometer(id: string, odometerKm: number): Promise<MyBike | null> {
    const bike = myBikes.find((b) => b.id === id);
    if (!bike) return null;
    Object.assign(bike, { odometerKm, odometerUpdatedAt: new Date().toISOString() });
    return bike;
  },
};
