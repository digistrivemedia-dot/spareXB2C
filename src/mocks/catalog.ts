import type {
  Category,
  Fitment,
  FitmentVehicle,
  PartBrand,
  Product,
  ProductFacets,
  ProductQuery,
  ProductSummary,
  RatingBreakdown,
  RelatedProducts,
  Review,
} from "@/features/catalog/types";
import { getFitStatus } from "@/features/catalog/utils";
import { getDiscountPercent } from "@/lib/price";
import type { Paginated } from "@/lib/types";
import { paginate } from "@/mocks/utils";
import { vehicleCatalog } from "@/mocks/vehicles";

const categories: Category[] = [
  { id: "cat-engine-oil", slug: "engine-oil", name: "Engine oil" },
  { id: "cat-brakes", slug: "brakes", name: "Brakes" },
  {
    id: "cat-chain-sprockets",
    slug: "chain-sprockets",
    name: "Chain & sprockets",
  },
  { id: "cat-filters", slug: "filters", name: "Filters" },
  { id: "cat-batteries", slug: "batteries", name: "Batteries" },
  { id: "cat-tyres", slug: "tyres", name: "Tyres" },
  {
    id: "cat-lights-electricals",
    slug: "lights-electricals",
    name: "Lights & electricals",
  },
  { id: "cat-clutch-cables", slug: "clutch-cables", name: "Clutch & cables" },
  { id: "cat-accessories", slug: "accessories", name: "Accessories" },
  { id: "cat-riding-gear", slug: "riding-gear", name: "Riding gear" },
];

const brands: PartBrand[] = [
  { id: "pb-motul", slug: "motul", name: "Motul" },
  { id: "pb-castrol", slug: "castrol", name: "Castrol" },
  { id: "pb-shell", slug: "shell", name: "Shell" },
  { id: "pb-rolon", slug: "rolon", name: "Rolon" },
  { id: "pb-bosch", slug: "bosch", name: "Bosch" },
  { id: "pb-uno-minda", slug: "uno-minda", name: "Uno Minda" },
  { id: "pb-exide", slug: "exide", name: "Exide" },
  { id: "pb-amaron", slug: "amaron", name: "Amaron" },
  { id: "pb-mrf", slug: "mrf", name: "MRF" },
  { id: "pb-tvs-eurogrip", slug: "tvs-eurogrip", name: "TVS Eurogrip" },
  { id: "pb-philips", slug: "philips", name: "Philips" },
  { id: "pb-steelbird", slug: "steelbird", name: "Steelbird" },
  { id: "pb-ktm", slug: "ktm", name: "KTM" },
  { id: "pb-honda", slug: "honda", name: "Honda" },
  { id: "pb-bajaj", slug: "bajaj", name: "Bajaj" },
  { id: "pb-royal-enfield", slug: "royal-enfield", name: "Royal Enfield" },
];

// Fitment helpers: build compatibility from the vehicle master so names and years always match it.
const universal: Fitment = { kind: "universal" };

function vehicle(
  modelId: string,
  only: { variants?: string[]; years?: number[] } = {},
): FitmentVehicle {
  const model = vehicleCatalog.models.find((m) => m.id === modelId);
  const brand = vehicleCatalog.brands.find((b) => b.id === model?.brandId);
  if (!model || !brand) throw new Error(`Unknown vehicle model in mock data: ${modelId}`);

  return {
    modelId,
    brandName: brand.name,
    modelName: model.name,
    variantIds: only.variants
      ? model.variants.filter((v) => only.variants?.includes(v.name)).map((v) => v.id)
      : null,
    years: only.years ?? model.years,
  };
}

function fits(...vehicles: (string | FitmentVehicle)[]): Fitment {
  return {
    kind: "specific",
    vehicles: vehicles.map((v) => (typeof v === "string" ? vehicle(v) : v)),
  };
}

type ProductSeed = Omit<
  Product,
  "id" | "isInstallable" | "sku" | "brand" | "category" | "image" | "images" | "rating"
> & {
  brandSlug: string;
  categorySlug: string;
  rating: number;
  ratingCount: number;
};

const seeds: ProductSeed[] = [
  // Engine oil
  {
    slug: "motul-7100-10w50-1l",
    name: "Motul 7100 4T 10W-50 Fully Synthetic Engine Oil (1 L)",
    brandSlug: "motul",
    categorySlug: "engine-oil",
    partNumber: "104097",
    priceInPaise: 89900,
    mrpInPaise: 98000,
    rating: 4.7,
    ratingCount: 1240,
    stockQuantity: 64,
    fitment: fits(
      "ktm-duke-200",
      "ktm-duke-390",
      "ktm-rc-200",
      "bajaj-pulsar-ns200",
      "yamaha-r15-v4",
    ),
    isGenuine: false,
    warrantyMonths: null,
    createdAt: "2025-03-12T10:00:00+05:30",
    description:
      "A 100% synthetic, ester-based 4-stroke oil for high-revving engines. It keeps the engine clean, protects the gearbox under hard riding and gives a smooth wet-clutch feel in Bengaluru traffic.",
    highlights: [
      "100% synthetic with ester technology",
      "JASO MA2 approved for smooth wet-clutch engagement",
      "Recommended grade for KTM Duke and RC 200 / 390",
      "Change every 5,000–7,000 km",
    ],
    specs: [
      { label: "Viscosity", value: "10W-50" },
      { label: "Type", value: "Fully synthetic (ester)" },
      { label: "Standards", value: "API SN, JASO MA2" },
      { label: "Volume", value: "1 litre" },
    ],
  },
  {
    slug: "castrol-power1-ultimate-15w50-1l",
    name: "Castrol Power1 Ultimate 4T 15W-50 Fully Synthetic Engine Oil (1 L)",
    brandSlug: "castrol",
    categorySlug: "engine-oil",
    partNumber: "3426581",
    priceInPaise: 74900,
    mrpInPaise: 82000,
    rating: 4.5,
    ratingCount: 860,
    stockQuantity: 48,
    fitment: fits(
      "royal-enfield-classic-350",
      "royal-enfield-bullet-350",
      "royal-enfield-hunter-350",
      "ktm-duke-200",
      "ktm-duke-390",
    ),
    isGenuine: false,
    warrantyMonths: null,
    createdAt: "2025-05-04T10:00:00+05:30",
    description:
      "Fully synthetic oil with Power Release technology for quicker throttle response. Thicker 15W-50 film suits air-cooled and hot-running engines.",
    highlights: [
      "Fully synthetic for long rides and city heat",
      "Protects against engine wear for up to 6,000 km",
      "JASO MA2 approved",
    ],
    specs: [
      { label: "Viscosity", value: "15W-50" },
      { label: "Type", value: "Fully synthetic" },
      { label: "Standards", value: "API SN, JASO MA2" },
      { label: "Volume", value: "1 litre" },
    ],
  },
  {
    slug: "shell-advance-ax7-10w30-1l",
    name: "Shell Advance AX7 10W-30 Semi-Synthetic Engine Oil (1 L)",
    brandSlug: "shell",
    categorySlug: "engine-oil",
    partNumber: "550052455",
    priceInPaise: 44900,
    mrpInPaise: 49900,
    rating: 4.4,
    ratingCount: 2105,
    stockQuantity: 120,
    fitment: fits(
      "hero-splendor-plus",
      "hero-hf-deluxe",
      "honda-shine-125",
      "honda-unicorn",
      "bajaj-pulsar-150",
      "bajaj-platina",
      "tvs-apache-rtr-160-4v",
      "yamaha-fz-s",
      "suzuki-gixxer",
    ),
    isGenuine: false,
    warrantyMonths: null,
    createdAt: "2025-01-20T10:00:00+05:30",
    description:
      "Semi-synthetic oil with active cleansing technology for everyday commuter and 150–160 cc bikes. Good cold starts and steady protection in stop-and-go traffic.",
    highlights: [
      "Semi-synthetic for daily commuting",
      "Keeps the engine clean",
      "JASO MA2 approved",
    ],
    specs: [
      { label: "Viscosity", value: "10W-30" },
      { label: "Type", value: "Semi-synthetic" },
      { label: "Standards", value: "API SN, JASO MA2" },
      { label: "Volume", value: "1 litre" },
    ],
  },
  {
    slug: "motul-scooter-expert-10w40-1l",
    name: "Motul Scooter Expert LE 10W-40 Engine Oil (1 L)",
    brandSlug: "motul",
    categorySlug: "engine-oil",
    partNumber: "105935",
    priceInPaise: 52900,
    mrpInPaise: 56000,
    rating: 4.5,
    ratingCount: 690,
    stockQuantity: 72,
    fitment: fits(
      "honda-activa-6g",
      "tvs-jupiter",
      "tvs-ntorq-125",
      "yamaha-fascino",
      "suzuki-access-125",
    ),
    isGenuine: false,
    warrantyMonths: null,
    createdAt: "2025-06-18T10:00:00+05:30",
    description:
      "Made for automatic scooters with a dry clutch. Reduces friction for better mileage and keeps the CVT running smoothly.",
    highlights: ["Made for gearless scooters", "Helps fuel economy", "JASO MB approved"],
    specs: [
      { label: "Viscosity", value: "10W-40" },
      { label: "Type", value: "Technosynthese (semi-synthetic)" },
      { label: "Standards", value: "API SL, JASO MB" },
      { label: "Volume", value: "1 litre" },
    ],
  },
  {
    slug: "castrol-activ-4t-20w40-1l",
    name: "Castrol Activ 4T 20W-40 Engine Oil (1 L)",
    brandSlug: "castrol",
    categorySlug: "engine-oil",
    partNumber: "3411752",
    priceInPaise: 45900,
    mrpInPaise: 49500,
    rating: 4.3,
    ratingCount: 1530,
    stockQuantity: 150,
    fitment: fits("hero-splendor-plus", "hero-hf-deluxe", "bajaj-platina", "honda-shine-125"),
    isGenuine: false,
    warrantyMonths: null,
    createdAt: "2024-11-02T10:00:00+05:30",
    description:
      "India's most trusted commuter bike oil. Actibond molecules cling to engine parts and protect them from the moment you start.",
    highlights: [
      "Protection from the first start",
      "Ideal for 100–125 cc commuters",
      "JASO MA2 approved",
    ],
    specs: [
      { label: "Viscosity", value: "20W-40" },
      { label: "Type", value: "Mineral" },
      { label: "Standards", value: "API SL, JASO MA2" },
      { label: "Volume", value: "1 litre" },
    ],
  },

  // Brakes
  {
    slug: "ktm-front-brake-pads-duke-200-rc-200",
    name: "KTM Genuine Front Brake Pad Set (Duke 200 / RC 200)",
    brandSlug: "ktm",
    categorySlug: "brakes",
    partNumber: "90113030000",
    priceInPaise: 115000,
    mrpInPaise: 125000,
    rating: 4.6,
    ratingCount: 214,
    stockQuantity: 18,
    fitment: fits("ktm-duke-200", "ktm-rc-200"),
    isGenuine: true,
    warrantyMonths: null,
    createdAt: "2025-02-08T10:00:00+05:30",
    description:
      "Original equipment sintered pads for the ByBre front caliper. Strong, predictable bite in wet weather and long pad life.",
    highlights: [
      "Genuine KTM part",
      "Sintered compound for wet-weather grip",
      "Direct fit, no modification",
    ],
    specs: [
      { label: "Position", value: "Front" },
      { label: "Compound", value: "Sintered" },
      { label: "Pieces", value: "2 pads with shims" },
      { label: "Caliper", value: "ByBre 4-piston" },
    ],
  },
  {
    slug: "ktm-rear-brake-pads-duke-rc",
    name: "KTM Genuine Rear Brake Pad Set (Duke 200 / 390, RC 200)",
    brandSlug: "ktm",
    categorySlug: "brakes",
    partNumber: "90213090000",
    priceInPaise: 89000,
    mrpInPaise: 95000,
    rating: 4.5,
    ratingCount: 156,
    stockQuantity: 3,
    fitment: fits("ktm-duke-200", "ktm-duke-390", "ktm-rc-200"),
    isGenuine: true,
    warrantyMonths: null,
    createdAt: "2025-02-08T10:00:00+05:30",
    description:
      "Original rear pads for the single-piston ByBre rear caliper. Quiet, smooth and long-lasting.",
    highlights: ["Genuine KTM part", "Quiet and low-dust", "Direct fit"],
    specs: [
      { label: "Position", value: "Rear" },
      { label: "Compound", value: "Organic" },
      { label: "Pieces", value: "2 pads" },
    ],
  },
  {
    slug: "bajaj-front-disc-pads-pulsar",
    name: "Bajaj Genuine Front Disc Brake Pads (Pulsar 150 / NS200)",
    brandSlug: "bajaj",
    categorySlug: "brakes",
    partNumber: "JF181061",
    priceInPaise: 34900,
    mrpInPaise: 39500,
    rating: 4.3,
    ratingCount: 388,
    stockQuantity: 40,
    fitment: fits("bajaj-pulsar-150", "bajaj-pulsar-ns200"),
    isGenuine: true,
    warrantyMonths: null,
    createdAt: "2025-07-15T10:00:00+05:30",
    description:
      "Original Bajaj pads with steady braking feel. The right choice before the monsoon.",
    highlights: [
      "Genuine Bajaj part",
      "Consistent bite in the rain",
      "Easy fit at home or at the garage",
    ],
    specs: [
      { label: "Position", value: "Front" },
      { label: "Compound", value: "Semi-metallic" },
      { label: "Pieces", value: "2 pads" },
    ],
  },
  {
    slug: "honda-rear-brake-shoe-set",
    name: "Honda Genuine Rear Brake Shoe Set (Activa 6G / Shine 125 Drum)",
    brandSlug: "honda",
    categorySlug: "brakes",
    partNumber: "06430-K2E-T01",
    priceInPaise: 34900,
    mrpInPaise: 39900,
    rating: 4.4,
    ratingCount: 512,
    stockQuantity: 36,
    fitment: fits("honda-activa-6g", vehicle("honda-shine-125", { variants: ["Drum"] })),
    isGenuine: true,
    warrantyMonths: null,
    createdAt: "2025-04-22T10:00:00+05:30",
    description: "Original Honda drum brake shoes with asbestos-free lining.",
    highlights: ["Genuine Honda part", "Asbestos-free lining", "Combi-brake compatible"],
    specs: [
      { label: "Position", value: "Rear" },
      { label: "Type", value: "Drum brake shoes" },
      { label: "Drum size", value: "130 mm" },
    ],
  },
  {
    slug: "royal-enfield-front-brake-pads-350",
    name: "Royal Enfield Genuine Front Brake Pads (Classic / Bullet / Hunter 350)",
    brandSlug: "royal-enfield",
    categorySlug: "brakes",
    partNumber: "591226",
    priceInPaise: 64900,
    mrpInPaise: 72000,
    rating: 4.5,
    ratingCount: 298,
    stockQuantity: 25,
    fitment: fits(
      "royal-enfield-classic-350",
      "royal-enfield-bullet-350",
      "royal-enfield-hunter-350",
    ),
    isGenuine: true,
    warrantyMonths: null,
    createdAt: "2025-08-01T10:00:00+05:30",
    description: "Original pads for the J-platform 350s, made for the bike's weight and ABS.",
    highlights: ["Genuine Royal Enfield part", "ABS compatible", "Long pad life"],
    specs: [
      { label: "Position", value: "Front" },
      { label: "Compound", value: "Sintered" },
      { label: "Pieces", value: "2 pads" },
    ],
  },
  {
    slug: "bosch-front-brake-pads-apache-rtr-160-4v",
    name: "Bosch Front Disc Brake Pads (Apache RTR 160 4V)",
    brandSlug: "bosch",
    categorySlug: "brakes",
    partNumber: "F002H23411",
    priceInPaise: 44900,
    mrpInPaise: 52000,
    rating: 4.2,
    ratingCount: 97,
    stockQuantity: 2,
    fitment: fits(vehicle("tvs-apache-rtr-160-4v", { variants: ["Disc"] })),
    isGenuine: false,
    warrantyMonths: null,
    createdAt: "2025-09-10T10:00:00+05:30",
    description: "Bosch semi-metallic pads with good heat resistance for spirited riding.",
    highlights: ["Semi-metallic compound", "Low fade when hot", "Disc variant only"],
    specs: [
      { label: "Position", value: "Front" },
      { label: "Compound", value: "Semi-metallic" },
      { label: "Pieces", value: "2 pads" },
    ],
  },

  // Chain & sprockets
  {
    slug: "rolon-o-ring-chain-kit-duke-200-rc-200",
    name: "Rolon O-Ring Chain & Sprocket Kit (KTM Duke 200 / RC 200)",
    brandSlug: "rolon",
    categorySlug: "chain-sprockets",
    partNumber: "RCK-KTM200-OR",
    priceInPaise: 289900,
    mrpInPaise: 325000,
    rating: 4.4,
    ratingCount: 176,
    stockQuantity: 4,
    fitment: fits("ktm-duke-200", "ktm-rc-200"),
    isGenuine: false,
    warrantyMonths: 6,
    createdAt: "2025-05-30T10:00:00+05:30",
    description:
      "O-ring chain with front and rear sprockets in the stock ratio. Sealed links hold grease longer, so the chain needs less adjustment.",
    highlights: [
      "O-ring sealed chain",
      "Front and rear sprockets included",
      "Stock gearing (14/45)",
    ],
    specs: [
      { label: "Chain", value: "520 O-ring, 118 links" },
      { label: "Front sprocket", value: "14 teeth" },
      { label: "Rear sprocket", value: "45 teeth" },
    ],
  },
  {
    slug: "rolon-chain-kit-classic-350",
    name: "Rolon Chain & Sprocket Kit (Royal Enfield Classic / Bullet 350)",
    brandSlug: "rolon",
    categorySlug: "chain-sprockets",
    partNumber: "RCK-RE350",
    priceInPaise: 234900,
    mrpInPaise: 260000,
    rating: 4.3,
    ratingCount: 241,
    stockQuantity: 14,
    fitment: fits("royal-enfield-classic-350", "royal-enfield-bullet-350"),
    isGenuine: false,
    warrantyMonths: 6,
    createdAt: "2025-03-03T10:00:00+05:30",
    description: "Heavy-duty chain kit with hardened sprockets for the torquey 350 engine.",
    highlights: ["Heavy-duty 428H chain", "Hardened sprockets", "Stock gearing"],
    specs: [
      { label: "Chain", value: "428H, 112 links" },
      { label: "Front sprocket", value: "15 teeth" },
      { label: "Rear sprocket", value: "39 teeth" },
    ],
  },
  {
    slug: "rolon-chain-kit-pulsar-150",
    name: "Rolon Chain & Sprocket Kit (Bajaj Pulsar 150)",
    brandSlug: "rolon",
    categorySlug: "chain-sprockets",
    partNumber: "RCK-PUL150",
    priceInPaise: 159900,
    mrpInPaise: 179000,
    rating: 4.2,
    ratingCount: 330,
    stockQuantity: 22,
    fitment: fits("bajaj-pulsar-150"),
    isGenuine: false,
    warrantyMonths: 6,
    createdAt: "2024-12-12T10:00:00+05:30",
    description: "Complete drive kit for the Pulsar 150 with a pre-stretched chain.",
    highlights: ["Pre-stretched chain", "Front and rear sprockets included", "Stock gearing"],
    specs: [
      { label: "Chain", value: "428H, 128 links" },
      { label: "Front sprocket", value: "15 teeth" },
      { label: "Rear sprocket", value: "42 teeth" },
    ],
  },
  {
    slug: "ktm-chain-kit-duke-390",
    name: "KTM Genuine Chain Kit (Duke 390)",
    brandSlug: "ktm",
    categorySlug: "chain-sprockets",
    partNumber: "90310965000",
    priceInPaise: 345000,
    mrpInPaise: 345000,
    rating: 4.6,
    ratingCount: 64,
    stockQuantity: 0,
    fitment: fits("ktm-duke-390"),
    isGenuine: true,
    warrantyMonths: 6,
    createdAt: "2025-10-01T10:00:00+05:30",
    description: "Original X-ring chain and sprocket set for the Duke 390.",
    highlights: ["Genuine KTM part", "X-ring chain", "Stock gearing"],
    specs: [
      { label: "Chain", value: "520 X-ring, 114 links" },
      { label: "Front sprocket", value: "15 teeth" },
      { label: "Rear sprocket", value: "45 teeth" },
    ],
  },
  {
    slug: "motul-c2-chain-lube-road-150ml",
    name: "Motul C2 Chain Lube Road (150 ml)",
    brandSlug: "motul",
    categorySlug: "chain-sprockets",
    partNumber: "102980",
    priceInPaise: 39900,
    mrpInPaise: 45000,
    rating: 4.6,
    ratingCount: 980,
    stockQuantity: 85,
    fitment: universal,
    isGenuine: false,
    warrantyMonths: null,
    createdAt: "2025-01-05T10:00:00+05:30",
    description:
      "White chain lube that sticks to the chain and doesn't fling off. Safe for O-ring and X-ring chains.",
    highlights: ["Safe for O-ring and X-ring chains", "Doesn't fling off", "Lube every 500 km"],
    specs: [
      { label: "Volume", value: "150 ml" },
      { label: "Type", value: "Spray" },
    ],
  },

  // Filters
  {
    slug: "ktm-air-filter-duke-rc",
    name: "KTM Genuine Air Filter (Duke 200 / 390, RC 200)",
    brandSlug: "ktm",
    categorySlug: "filters",
    partNumber: "90106015000",
    priceInPaise: 64900,
    mrpInPaise: 69900,
    rating: 4.6,
    ratingCount: 188,
    stockQuantity: 20,
    fitment: fits("ktm-duke-200", "ktm-duke-390", "ktm-rc-200"),
    isGenuine: true,
    warrantyMonths: null,
    createdAt: "2025-02-14T10:00:00+05:30",
    description:
      "Original paper element air filter. Replace every 10,000 km, sooner on dusty roads.",
    highlights: ["Genuine KTM part", "Replace every 10,000 km", "Keeps fuel mapping as designed"],
    specs: [
      { label: "Type", value: "Paper element" },
      { label: "Service interval", value: "10,000 km" },
    ],
  },
  {
    slug: "ktm-oil-filter-duke-rc",
    name: "KTM Genuine Oil Filter (Duke 200 / 390, RC 200)",
    brandSlug: "ktm",
    categorySlug: "filters",
    partNumber: "90138015000",
    priceInPaise: 28900,
    mrpInPaise: 32000,
    rating: 4.7,
    ratingCount: 402,
    stockQuantity: 55,
    fitment: fits("ktm-duke-200", "ktm-duke-390", "ktm-rc-200"),
    isGenuine: true,
    warrantyMonths: null,
    createdAt: "2025-02-14T10:00:00+05:30",
    description: "Original oil filter. Change it with every engine oil change.",
    highlights: ["Genuine KTM part", "Change with every oil change", "O-ring included"],
    specs: [
      { label: "Type", value: "Cartridge" },
      { label: "Included", value: "Filter and O-ring" },
    ],
  },
  {
    slug: "uno-minda-air-filter-activa-6g",
    name: "Uno Minda Air Filter (Honda Activa 6G)",
    brandSlug: "uno-minda",
    categorySlug: "filters",
    partNumber: "AF-H-ACT6G",
    priceInPaise: 27900,
    mrpInPaise: 34000,
    rating: 4.2,
    ratingCount: 275,
    stockQuantity: 42,
    fitment: fits("honda-activa-6g"),
    isGenuine: false,
    warrantyMonths: null,
    createdAt: "2025-04-11T10:00:00+05:30",
    description: "Viscous paper air filter made to OE size. Helps mileage and smooth pick-up.",
    highlights: ["OE-size viscous element", "Replace every 12,000 km", "Direct fit"],
    specs: [
      { label: "Type", value: "Viscous paper" },
      { label: "Service interval", value: "12,000 km" },
    ],
  },
  {
    slug: "bosch-air-filter-royal-enfield-350",
    name: "Bosch Air Filter (Royal Enfield Classic / Bullet / Hunter 350)",
    brandSlug: "bosch",
    categorySlug: "filters",
    partNumber: "F002H6RE35",
    priceInPaise: 54900,
    mrpInPaise: 61000,
    rating: 4.3,
    ratingCount: 122,
    stockQuantity: 16,
    fitment: fits(
      "royal-enfield-classic-350",
      "royal-enfield-bullet-350",
      "royal-enfield-hunter-350",
    ),
    isGenuine: false,
    warrantyMonths: null,
    createdAt: "2025-06-02T10:00:00+05:30",
    description: "High-capacity Bosch filter element that traps fine dust without choking airflow.",
    highlights: ["Traps fine dust", "Maintains airflow", "Direct fit"],
    specs: [
      { label: "Type", value: "Paper element" },
      { label: "Service interval", value: "10,000 km" },
    ],
  },

  // Batteries
  {
    slug: "exide-xplore-xltz5-12v-4ah",
    name: "Exide Xplore XLTZ5 12V 4Ah Maintenance-Free Battery",
    brandSlug: "exide",
    categorySlug: "batteries",
    partNumber: "XLTZ5",
    priceInPaise: 134900,
    mrpInPaise: 159900,
    rating: 4.4,
    ratingCount: 1102,
    stockQuantity: 30,
    fitment: fits(
      "honda-activa-6g",
      "tvs-jupiter",
      "tvs-ntorq-125",
      "suzuki-access-125",
      "yamaha-fascino",
      "honda-shine-125",
      "hero-splendor-plus",
    ),
    isGenuine: false,
    warrantyMonths: 36,
    createdAt: "2025-01-28T10:00:00+05:30",
    description: "Factory-charged, maintenance-free battery. No water top-ups, ready to fit.",
    highlights: ["Maintenance-free, factory charged", "36-month warranty", "Reliable self-start"],
    specs: [
      { label: "Voltage", value: "12 V" },
      { label: "Capacity", value: "4 Ah" },
      { label: "Type", value: "VRLA, maintenance-free" },
    ],
  },
  {
    slug: "amaron-pro-bike-rider-etz9-12v-8ah",
    name: "Amaron Pro Bike Rider ETZ9 12V 8Ah Battery",
    brandSlug: "amaron",
    categorySlug: "batteries",
    partNumber: "AP-BTZ9",
    priceInPaise: 279900,
    mrpInPaise: 315000,
    rating: 4.5,
    ratingCount: 318,
    stockQuantity: 12,
    fitment: fits(
      "ktm-duke-200",
      "ktm-duke-390",
      "ktm-rc-200",
      "bajaj-pulsar-ns200",
      "yamaha-r15-v4",
    ),
    isGenuine: false,
    warrantyMonths: 48,
    createdAt: "2025-03-19T10:00:00+05:30",
    description: "High-cranking battery for fuel-injected performance bikes with more electronics.",
    highlights: ["High cranking power", "48-month warranty", "Maintenance-free"],
    specs: [
      { label: "Voltage", value: "12 V" },
      { label: "Capacity", value: "8 Ah" },
      { label: "Type", value: "VRLA, maintenance-free" },
    ],
  },
  {
    slug: "exide-xplore-xltz7-12v-6ah",
    name: "Exide Xplore XLTZ7 12V 6Ah Maintenance-Free Battery",
    brandSlug: "exide",
    categorySlug: "batteries",
    partNumber: "XLTZ7",
    priceInPaise: 189900,
    mrpInPaise: 219900,
    rating: 4.3,
    ratingCount: 446,
    stockQuantity: 5,
    fitment: fits(
      "royal-enfield-classic-350",
      "royal-enfield-bullet-350",
      "royal-enfield-hunter-350",
      "bajaj-pulsar-150",
      "tvs-apache-rtr-160-4v",
      "yamaha-fz-s",
      "suzuki-gixxer",
    ),
    isGenuine: false,
    warrantyMonths: 36,
    createdAt: "2025-05-21T10:00:00+05:30",
    description: "Maintenance-free battery for 150–350 cc bikes. Strong starts on cold mornings.",
    highlights: ["Maintenance-free, factory charged", "36-month warranty", "Strong cold starts"],
    specs: [
      { label: "Voltage", value: "12 V" },
      { label: "Capacity", value: "6 Ah" },
      { label: "Type", value: "VRLA, maintenance-free" },
    ],
  },

  // Tyres
  {
    slug: "mrf-revz-fc-110-70-r17-front",
    name: "MRF Revz-FC 110/70 R17 Tubeless Front Tyre",
    brandSlug: "mrf",
    categorySlug: "tyres",
    partNumber: "REVZFC-1107017",
    priceInPaise: 289000,
    mrpInPaise: 320000,
    rating: 4.5,
    ratingCount: 205,
    stockQuantity: 9,
    fitment: fits("ktm-duke-200", "ktm-duke-390", "ktm-rc-200"),
    isGenuine: false,
    warrantyMonths: null,
    createdAt: "2025-07-07T10:00:00+05:30",
    description:
      "Radial sports tyre with a dual-compound tread for grip in corners and on wet roads.",
    highlights: ["Radial construction", "Grippy in the wet", "Tubeless"],
    specs: [
      { label: "Size", value: "110/70 R17" },
      { label: "Position", value: "Front" },
      { label: "Type", value: "Tubeless radial" },
      { label: "Load / speed index", value: "54H" },
    ],
  },
  {
    slug: "mrf-revz-c1-150-60-r17-rear",
    name: "MRF Revz-C1 150/60 R17 Tubeless Rear Tyre",
    brandSlug: "mrf",
    categorySlug: "tyres",
    partNumber: "REVZC1-1506017",
    priceInPaise: 429000,
    mrpInPaise: 465000,
    rating: 4.6,
    ratingCount: 148,
    stockQuantity: 2,
    fitment: fits("ktm-duke-200", "ktm-rc-200"),
    isGenuine: false,
    warrantyMonths: null,
    createdAt: "2025-07-07T10:00:00+05:30",
    description: "Wide radial rear tyre that puts power down cleanly and wears evenly.",
    highlights: ["Radial construction", "Even wear", "Tubeless"],
    specs: [
      { label: "Size", value: "150/60 R17" },
      { label: "Position", value: "Rear" },
      { label: "Type", value: "Tubeless radial" },
      { label: "Load / speed index", value: "66H" },
    ],
  },
  {
    slug: "tvs-eurogrip-bee-connect-90-100-10",
    name: "TVS Eurogrip Bee Connect 90/100-10 Tubeless Scooter Tyre",
    brandSlug: "tvs-eurogrip",
    categorySlug: "tyres",
    partNumber: "BEECON-9010010",
    priceInPaise: 165000,
    mrpInPaise: 189000,
    rating: 4.3,
    ratingCount: 522,
    stockQuantity: 28,
    fitment: fits("honda-activa-6g", "tvs-jupiter", "suzuki-access-125"),
    isGenuine: false,
    warrantyMonths: null,
    createdAt: "2025-04-01T10:00:00+05:30",
    description:
      "All-round scooter tyre with deep grooves that clear water quickly. Fits front or rear.",
    highlights: ["Fits front or rear", "Deep grooves for the rain", "Tubeless"],
    specs: [
      { label: "Size", value: "90/100-10" },
      { label: "Position", value: "Front or rear" },
      { label: "Type", value: "Tubeless" },
    ],
  },
  {
    slug: "tvs-eurogrip-protorq-110-80-17-rear",
    name: "TVS Eurogrip Protorq 110/80-17 Tubeless Rear Tyre",
    brandSlug: "tvs-eurogrip",
    categorySlug: "tyres",
    partNumber: "PROTQ-1108017",
    priceInPaise: 215000,
    mrpInPaise: 240000,
    rating: 4.4,
    ratingCount: 264,
    stockQuantity: 18,
    fitment: fits("tvs-apache-rtr-160-4v", "bajaj-pulsar-150"),
    isGenuine: false,
    warrantyMonths: null,
    createdAt: "2025-08-19T10:00:00+05:30",
    description: "Sporty rear tyre for 150–160 cc bikes with good mileage and stable cornering.",
    highlights: ["Stable cornering", "Long tread life", "Tubeless"],
    specs: [
      { label: "Size", value: "110/80-17" },
      { label: "Position", value: "Rear" },
      { label: "Type", value: "Tubeless" },
    ],
  },

  // Lights & electricals
  {
    slug: "philips-ultinon-essential-led-hs1",
    name: "Philips Ultinon Essential LED HS1 Headlight Bulb",
    brandSlug: "philips",
    categorySlug: "lights-electricals",
    partNumber: "11636UE2X1",
    priceInPaise: 114900,
    mrpInPaise: 139900,
    rating: 4.3,
    ratingCount: 612,
    stockQuantity: 33,
    fitment: fits(
      "hero-splendor-plus",
      "hero-hf-deluxe",
      "honda-shine-125",
      "honda-unicorn",
      "honda-activa-6g",
      "bajaj-platina",
      "bajaj-pulsar-150",
    ),
    isGenuine: false,
    warrantyMonths: 12,
    createdAt: "2025-09-01T10:00:00+05:30",
    description:
      "Plug-and-play LED with a cool white beam. Brighter than the stock halogen and draws less power.",
    highlights: ["Plug-and-play HS1 fitting", "Cool white 6,000 K beam", "12-month warranty"],
    specs: [
      { label: "Fitting", value: "HS1" },
      { label: "Colour temperature", value: "6,000 K" },
      { label: "Power", value: "12 V, 10 W" },
    ],
  },
  {
    slug: "philips-vision-h4-12v-60-55w",
    name: "Philips Vision H4 12V 60/55W Halogen Bulb",
    brandSlug: "philips",
    categorySlug: "lights-electricals",
    partNumber: "12342PRC1",
    priceInPaise: 39900,
    mrpInPaise: 45000,
    rating: 4.4,
    ratingCount: 840,
    stockQuantity: 60,
    fitment: fits("royal-enfield-classic-350", "royal-enfield-bullet-350"),
    isGenuine: false,
    warrantyMonths: null,
    createdAt: "2024-10-15T10:00:00+05:30",
    description:
      "Up to 30% more light than a standard halogen, with the warm beam riders trust in rain and fog.",
    highlights: ["30% more light", "Warm beam for rain and fog", "Direct replacement"],
    specs: [
      { label: "Fitting", value: "H4 (P43t)" },
      { label: "Power", value: "12 V, 60/55 W" },
    ],
  },
  {
    slug: "bosch-ec9-dual-tone-horn-set",
    name: "Bosch EC9 Dual Tone Horn Set (12V)",
    brandSlug: "bosch",
    categorySlug: "lights-electricals",
    partNumber: "0986AH0503",
    priceInPaise: 99900,
    mrpInPaise: 119000,
    rating: 4.5,
    ratingCount: 1430,
    stockQuantity: 40,
    fitment: universal,
    isGenuine: false,
    warrantyMonths: 12,
    createdAt: "2025-02-25T10:00:00+05:30",
    description:
      "Loud, clear dual-tone horns that are heard in heavy traffic. Comes with a relay and wiring.",
    highlights: ["High and low tone pair", "Relay and wiring included", "12-month warranty"],
    specs: [
      { label: "Voltage", value: "12 V" },
      { label: "Sound level", value: "110 dB" },
      { label: "In the box", value: "2 horns, relay, wiring" },
    ],
  },
  {
    slug: "uno-minda-sequential-led-indicators-pair",
    name: "Uno Minda Sequential LED Turn Indicators (Pair)",
    brandSlug: "uno-minda",
    categorySlug: "lights-electricals",
    partNumber: "TI-LED-SQ2",
    priceInPaise: 44900,
    mrpInPaise: 52000,
    rating: 4.1,
    ratingCount: 233,
    stockQuantity: 26,
    fitment: universal,
    isGenuine: false,
    warrantyMonths: 6,
    createdAt: "2025-10-04T10:00:00+05:30",
    description:
      "Bright sequential LED indicators with a standard M8 mount. Add a load resistor for the correct blink rate.",
    highlights: ["Standard M8 mount", "Water resistant", "6-month warranty"],
    specs: [
      { label: "Mount", value: "M8 bolt" },
      { label: "Voltage", value: "12 V" },
      { label: "In the box", value: "2 indicators" },
    ],
  },

  // Clutch & cables
  {
    slug: "ktm-clutch-cable-duke-200",
    name: "KTM Genuine Clutch Cable (Duke 200)",
    brandSlug: "ktm",
    categorySlug: "clutch-cables",
    partNumber: "90202069000",
    priceInPaise: 38900,
    mrpInPaise: 42000,
    rating: 4.6,
    ratingCount: 88,
    stockQuantity: 11,
    fitment: fits("ktm-duke-200"),
    isGenuine: true,
    warrantyMonths: null,
    createdAt: "2025-03-27T10:00:00+05:30",
    description: "Original Teflon-lined clutch cable for a light, smooth lever feel.",
    highlights: ["Genuine KTM part", "Teflon-lined for a light lever", "Exact routing length"],
    specs: [
      { label: "Type", value: "Teflon-lined" },
      { label: "Length", value: "1,120 mm" },
    ],
  },
  {
    slug: "uno-minda-clutch-plate-set-pulsar-150",
    name: "Uno Minda Clutch Plate Set (Bajaj Pulsar 150)",
    brandSlug: "uno-minda",
    categorySlug: "clutch-cables",
    partNumber: "CP-BJ-PUL150",
    priceInPaise: 105000,
    mrpInPaise: 118000,
    rating: 4.2,
    ratingCount: 141,
    stockQuantity: 15,
    fitment: fits("bajaj-pulsar-150"),
    isGenuine: false,
    warrantyMonths: null,
    createdAt: "2025-06-25T10:00:00+05:30",
    description: "Friction plate set that cures clutch slip and restores pick-up.",
    highlights: ["Cures clutch slip", "Full set of friction plates", "OE specification"],
    specs: [
      { label: "Plates", value: "5 friction plates" },
      { label: "Material", value: "Cork-rubber composite" },
    ],
  },
  {
    slug: "honda-throttle-cable-activa-6g",
    name: "Honda Genuine Throttle Cable (Activa 6G)",
    brandSlug: "honda",
    categorySlug: "clutch-cables",
    partNumber: "17910-K2E-T00",
    priceInPaise: 17900,
    mrpInPaise: 19900,
    rating: 4.5,
    ratingCount: 203,
    stockQuantity: 40,
    fitment: fits("honda-activa-6g"),
    isGenuine: true,
    warrantyMonths: null,
    createdAt: "2025-05-08T10:00:00+05:30",
    description: "Original throttle cable for a smooth, even twist-grip.",
    highlights: ["Genuine Honda part", "Smooth throttle return", "Exact length"],
    specs: [
      { label: "Type", value: "Throttle cable" },
      { label: "Length", value: "830 mm" },
    ],
  },

  // Accessories
  {
    slug: "uno-minda-mobile-holder-usb-charger",
    name: "Uno Minda Bike Mobile Holder with USB Fast Charger",
    brandSlug: "uno-minda",
    categorySlug: "accessories",
    partNumber: "MH-USB-QC3",
    priceInPaise: 84900,
    mrpInPaise: 109900,
    rating: 4.2,
    ratingCount: 1876,
    stockQuantity: 50,
    fitment: universal,
    isGenuine: false,
    warrantyMonths: 6,
    createdAt: "2025-08-28T10:00:00+05:30",
    description:
      "Anti-vibration handlebar mount with a waterproof USB fast charger. Holds phones up to 6.8 inches.",
    highlights: ["Anti-vibration grip", "Waterproof QC 3.0 USB charger", "Fits 22 mm handlebars"],
    specs: [
      { label: "Phone size", value: "Up to 6.8 inches" },
      { label: "Charger", value: "USB QC 3.0, 18 W" },
      { label: "Mount", value: "22 mm handlebar" },
    ],
  },
  {
    slug: "ktm-frame-sliders-duke-2024",
    name: "KTM Genuine Frame Sliders (Duke 200 / 390, 2024 onwards)",
    brandSlug: "ktm",
    categorySlug: "accessories",
    partNumber: "93612911044",
    priceInPaise: 245000,
    mrpInPaise: 270000,
    rating: 4.4,
    ratingCount: 39,
    stockQuantity: 7,
    fitment: fits(
      vehicle("ktm-duke-200", { years: [2025, 2024] }),
      vehicle("ktm-duke-390", { years: [2025, 2024] }),
    ),
    isGenuine: true,
    warrantyMonths: null,
    createdAt: "2025-09-22T10:00:00+05:30",
    description:
      "Protects the frame and engine covers in a tip-over. Made for the new-generation Duke frame.",
    highlights: ["Genuine KTM PowerParts", "Only for 2024 onwards models", "Bolt-on, no cutting"],
    specs: [
      { label: "Material", value: "Polyamide pucks, aluminium brackets" },
      { label: "In the box", value: "Left and right sliders, bolts" },
    ],
  },

  // Riding gear
  {
    slug: "steelbird-sba-7-7wings-full-face-helmet",
    name: "Steelbird SBA-7 7Wings Full Face Helmet (ISI, Matt Black)",
    brandSlug: "steelbird",
    categorySlug: "riding-gear",
    partNumber: "SBA-7-MB-M",
    priceInPaise: 159900,
    mrpInPaise: 189900,
    rating: 4.3,
    ratingCount: 2310,
    stockQuantity: 45,
    fitment: universal,
    isGenuine: false,
    warrantyMonths: null,
    createdAt: "2025-04-30T10:00:00+05:30",
    description:
      "ISI-certified full-face helmet with a clear visor, removable washable lining and a quick-release buckle.",
    highlights: ["ISI certified", "Removable, washable lining", "Quick-release buckle"],
    specs: [
      { label: "Certification", value: "ISI (IS 4151)" },
      { label: "Size", value: "Medium (580 mm)" },
      { label: "Weight", value: "1,250 g" },
    ],
  },
  {
    slug: "steelbird-air-sba-2-full-face-helmet",
    name: "Steelbird Air SBA-2 Full Face Helmet (ISI & DOT, Glossy Red)",
    brandSlug: "steelbird",
    categorySlug: "riding-gear",
    partNumber: "SBA-2-GR-L",
    priceInPaise: 249900,
    mrpInPaise: 299900,
    rating: 4.4,
    ratingCount: 980,
    stockQuantity: 6,
    fitment: universal,
    isGenuine: false,
    warrantyMonths: null,
    createdAt: "2025-10-02T10:00:00+05:30",
    description:
      "Dual-certified helmet with an inner sun visor and good ventilation for city heat.",
    highlights: ["ISI and DOT certified", "Inner sun visor", "Front and rear vents"],
    specs: [
      { label: "Certification", value: "ISI and DOT" },
      { label: "Size", value: "Large (600 mm)" },
      { label: "Weight", value: "1,400 g" },
    ],
  },
];

// Stock photos per kind of part, until the client sends real product photos.
const productPhotos: Record<string, string> = {
  "motul-7100-10w50-1l": "engine-oil-2",
  "castrol-power1-ultimate-15w50-1l": "engine-oil-1",
  "shell-advance-ax7-10w30-1l": "engine-oil-2",
  "motul-scooter-expert-10w40-1l": "engine-oil-1",
  "castrol-activ-4t-20w40-1l": "engine-oil-2",
  "ktm-front-brake-pads-duke-200-rc-200": "brakes-1",
  "ktm-rear-brake-pads-duke-rc": "brakes-3",
  "bajaj-front-disc-pads-pulsar": "brakes-2",
  "honda-rear-brake-shoe-set": "brakes-3",
  "royal-enfield-front-brake-pads-350": "brakes-1",
  "bosch-front-brake-pads-apache-rtr-160-4v": "brakes-2",
  "rolon-o-ring-chain-kit-duke-200-rc-200": "chain-1",
  "rolon-chain-kit-classic-350": "chain-2",
  "rolon-chain-kit-pulsar-150": "chain-1",
  "ktm-chain-kit-duke-390": "chain-2",
  "motul-c2-chain-lube-road-150ml": "chain-lube",
  "ktm-air-filter-duke-rc": "filter-1",
  "ktm-oil-filter-duke-rc": "filter-1",
  "uno-minda-air-filter-activa-6g": "filter-1",
  "bosch-air-filter-royal-enfield-350": "filter-1",
  "exide-xplore-xltz5-12v-4ah": "battery-1",
  "amaron-pro-bike-rider-etz9-12v-8ah": "battery-2",
  "exide-xplore-xltz7-12v-6ah": "battery-1",
  "mrf-revz-fc-110-70-r17-front": "tyre-1",
  "mrf-revz-c1-150-60-r17-rear": "tyre-1",
  "tvs-eurogrip-bee-connect-90-100-10": "tyre-1",
  "tvs-eurogrip-protorq-110-80-17-rear": "tyre-1",
  "philips-ultinon-essential-led-hs1": "lights-1",
  "philips-vision-h4-12v-60-55w": "lights-2",
  "bosch-ec9-dual-tone-horn-set": "lights-2",
  "uno-minda-sequential-led-indicators-pair": "lights-1",
  "ktm-clutch-cable-duke-200": "controls-1",
  "uno-minda-clutch-plate-set-pulsar-150": "controls-2",
  "honda-throttle-cable-activa-6g": "controls-1",
  "uno-minda-mobile-holder-usb-charger": "phone-holder",
  "ktm-frame-sliders-duke-2024": "controls-2",
  "steelbird-sba-7-7wings-full-face-helmet": "helmet-1",
  "steelbird-air-sba-2-full-face-helmet": "helmet-2",
};

const products: Product[] = seeds.map(
  ({ brandSlug, categorySlug, rating, ratingCount, ...seed }, index) => {
    const brand = brands.find((b) => b.slug === brandSlug);
    const category = categories.find((c) => c.slug === categorySlug);
    if (!brand || !category)
      throw new Error(`Unknown brand or category in mock product: ${seed.slug}`);

    return {
      ...seed,
      id: `prd-${String(index + 1).padStart(3, "0")}`,
      sku: `KG-${String(10001 + index)}`,
      brand,
      category,
      rating: { average: rating, count: ratingCount },
      image: null,
      images: [{ url: `/images/products/${productPhotos[seed.slug]}.jpg`, alt: seed.name }],
      isInstallable: categorySlug !== "riding-gear",
    };
  },
);

const reviews: Review[] = [
  {
    id: "rev-001",
    productId: "prd-001",
    authorName: "Karthik S.",
    rating: 5,
    title: "Engine feels smoother",
    body: "Using this on my Duke 200 for two oil changes now. Gear shifts are slicker and the engine runs cooler in traffic.",
    isVerifiedPurchase: true,
    createdAt: "2026-08-14T19:20:00+05:30",
  },
  {
    id: "rev-002",
    productId: "prd-001",
    authorName: "Pooja N.",
    rating: 4,
    title: "Genuine product, quick delivery",
    body: "Seal was intact and the batch date was recent. Delivered to Indiranagar in two days.",
    isVerifiedPurchase: true,
    createdAt: "2026-07-02T11:05:00+05:30",
  },
  {
    id: "rev-003",
    productId: "prd-001",
    authorName: "Mohammed I.",
    rating: 5,
    title: "Best oil for the RC 200",
    body: "Have tried a few brands. This one keeps the clutch light even after 5,000 km.",
    isVerifiedPurchase: false,
    createdAt: "2026-05-21T08:45:00+05:30",
  },
  {
    id: "rev-004",
    productId: "prd-006",
    authorName: "Vikram R.",
    rating: 5,
    title: "Fit perfectly",
    body: "Exact fit for my 2023 Duke 200. Bite is strong even in the rain. Got it fitted at Kannali Garage Whitefield.",
    isVerifiedPurchase: true,
    createdAt: "2026-09-03T17:30:00+05:30",
  },
  {
    id: "rev-005",
    productId: "prd-006",
    authorName: "Sneha M.",
    rating: 4,
    title: "Original part, worth it",
    body: "Slightly pricier than aftermarket, but the feel is exactly like stock.",
    isVerifiedPurchase: true,
    createdAt: "2026-06-18T13:10:00+05:30",
  },
  {
    id: "rev-006",
    productId: "prd-024",
    authorName: "Arun K.",
    rating: 5,
    title: "Great grip",
    body: "Huge improvement over the worn stock tyre. Confident on wet roads around Hebbal.",
    isVerifiedPurchase: true,
    createdAt: "2026-07-29T09:00:00+05:30",
  },
  {
    id: "rev-007",
    productId: "prd-024",
    authorName: "Deepa V.",
    rating: 4,
    title: "Good value",
    body: "Good tyre for the price. Took a few hundred kilometres to scrub in.",
    isVerifiedPurchase: true,
    createdAt: "2026-04-11T16:40:00+05:30",
  },
  {
    id: "rev-008",
    productId: "prd-037",
    authorName: "Rahul P.",
    rating: 4,
    title: "Comfortable for daily use",
    body: "Light and comfortable for my office commute. The visor could be a little clearer at night.",
    isVerifiedPurchase: true,
    createdAt: "2026-09-12T20:15:00+05:30",
  },
  {
    id: "rev-009",
    productId: "prd-037",
    authorName: "Ananya G.",
    rating: 5,
    title: "Good fit and finish",
    body: "Medium size fits well. Lining is soft and easy to remove for washing.",
    isVerifiedPurchase: false,
    createdAt: "2026-03-08T10:30:00+05:30",
  },
];

function toSummary({
  images,
  description,
  highlights,
  specs,
  ...summary
}: Product): ProductSummary {
  return { ...summary, image: images[0] ?? null };
}

// Searches the part itself and the bikes it fits, so "KTM" or "Activa" finds compatible parts too.
function matchesSearch(product: Product, q: string): boolean {
  const fitsNames =
    product.fitment.kind === "specific"
      ? product.fitment.vehicles.map((v) => `${v.brandName} ${v.modelName}`)
      : [];
  const haystack = [
    product.name,
    product.brand.name,
    product.category.name,
    product.partNumber,
    product.sku,
    ...fitsNames,
  ]
    .join(" ")
    .toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}

function discountOf(product: Product): number {
  return getDiscountPercent(product.priceInPaise, product.mrpInPaise);
}

function matchesQuery(p: Product, query: ProductQuery): boolean {
  const { q, category, brand, fits: bike, minPriceInPaise, maxPriceInPaise, inStock } = query;
  const { minRating, minDiscountPercent, hasWarranty } = query;
  return (
    (!q || matchesSearch(p, q)) &&
    (!category || p.category.slug === category) &&
    (!brand?.length || brand.includes(p.brand.slug)) &&
    (!bike || getFitStatus(p.fitment, bike) !== "no-fit") &&
    (minPriceInPaise === undefined || p.priceInPaise >= minPriceInPaise) &&
    (maxPriceInPaise === undefined || p.priceInPaise <= maxPriceInPaise) &&
    (!inStock || p.stockQuantity > 0) &&
    (minRating === undefined || p.rating.average >= minRating) &&
    (minDiscountPercent === undefined || discountOf(p) >= minDiscountPercent) &&
    (!hasWarranty || p.warrantyMonths !== null)
  );
}

const sorters: Record<
  NonNullable<ProductQuery["sort"]>,
  ((a: Product, b: Product) => number) | null
> = {
  relevance: null,
  "price-asc": (a, b) => a.priceInPaise - b.priceInPaise,
  "price-desc": (a, b) => b.priceInPaise - a.priceInPaise,
  newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
  rating: (a, b) => b.rating.average - a.rating.average || b.rating.count - a.rating.count,
  discount: (a, b) => discountOf(b) - discountOf(a),
  popular: (a, b) => b.rating.count - a.rating.count,
};

/** A believable star spread that matches the product's average and count. */
function ratingBreakdown(product: Product): RatingBreakdown {
  const { average, count } = product.rating;
  const shift = average - 4.3;
  const weights = [
    0.03 - shift * 0.05,
    0.04 - shift * 0.1,
    0.1 - shift * 0.2,
    0.28,
    0.55 + shift * 0.35,
  ].map((w) => Math.max(w, 0.01));
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const counts = weights.map((w) => Math.round((w / totalWeight) * count));
  counts[4] += count - counts.reduce((sum, c) => sum + c, 0);
  return {
    average,
    count,
    distribution: counts as RatingBreakdown["distribution"],
  };
}

/** For other demo handlers (orders) that price items by id, as the backend would. */
export function findProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export const mockCatalog = {
  async getCategories(): Promise<Category[]> {
    return categories;
  },

  async getBrands(): Promise<PartBrand[]> {
    return brands;
  },

  async getProducts(query: ProductQuery = {}): Promise<Paginated<ProductSummary>> {
    const { fits: bike, sort = "relevance", page, pageSize } = query;
    const matching = products.filter((p) => matchesQuery(p, query));

    // With a bike, "relevance" puts parts made for that bike ahead of universal ones.
    const sorter =
      sort === "relevance" && bike
        ? (a: Product, b: Product) =>
            Number(a.fitment.kind === "universal") - Number(b.fitment.kind === "universal") ||
            b.rating.count - a.rating.count
        : sorters[sort];
    const sorted = sorter ? [...matching].sort(sorter) : matching;
    return paginate(sorted.map(toSummary), page, pageSize);
  },

  // Each facet is counted with every other filter applied but not its own, so the
  // customer sees what picking another brand or category would give.
  async getProductFacets(query: ProductQuery = {}): Promise<ProductFacets> {
    const countBy = <T extends { slug: string; name: string }>(
      options: T[],
      matching: Product[],
      key: (p: Product) => T,
    ) =>
      options
        .map(({ slug, name }) => ({
          slug,
          name,
          count: matching.filter((p) => key(p).slug === slug).length,
        }))
        .filter((facet) => facet.count > 0);

    const withoutCategory = products.filter((p) =>
      matchesQuery(p, { ...query, category: undefined }),
    );
    const withoutBrand = products.filter((p) => matchesQuery(p, { ...query, brand: undefined }));
    return {
      categories: countBy(categories, withoutCategory, (p) => p.category),
      brands: countBy(brands, withoutBrand, (p) => p.brand),
    };
  },

  async getProduct(slug: string): Promise<Product | null> {
    return products.find((p) => p.slug === slug) ?? null;
  },

  // Bought together: other kinds of part for the same bikes (or other universal items).
  // Similar: the rest of the same category. Both most popular first.
  async getRelatedProducts(productId: string): Promise<RelatedProducts | null> {
    const product = products.find((p) => p.id === productId);
    if (!product) return null;

    const modelIds = (p: Product) =>
      p.fitment.kind === "specific" ? p.fitment.vehicles.map((v) => v.modelId) : [];
    const sharesBike = (p: Product) => modelIds(p).some((id) => modelIds(product).includes(id));
    const others = products
      .filter((p) => p.id !== product.id)
      .sort((a, b) => b.rating.count - a.rating.count);

    return {
      boughtTogether: others
        .filter((p) => p.category.id !== product.category.id)
        .filter((p) =>
          product.fitment.kind === "universal" ? p.fitment.kind === "universal" : sharesBike(p),
        )
        .slice(0, 8)
        .map(toSummary),
      similar: others
        .filter((p) => p.category.id === product.category.id)
        .slice(0, 10)
        .map(toSummary),
    };
  },

  async getProductReviews(
    productId: string,
    page = 1,
  ): Promise<{
    breakdown: RatingBreakdown;
    reviews: Paginated<Review>;
  } | null> {
    const product = products.find((p) => p.id === productId);
    if (!product) return null;

    const productReviews = reviews
      .filter((r) => r.productId === productId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return {
      breakdown: ratingBreakdown(product),
      reviews: paginate(productReviews, page, 5),
    };
  },
};
