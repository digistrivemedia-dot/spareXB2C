import {
  BatteryCharging,
  Cable,
  CircleDot,
  Disc3,
  Droplet,
  Funnel,
  HardHat,
  Lightbulb,
  Link as ChainIcon,
  type LucideIcon,
  Package,
  Smartphone,
} from "lucide-react";
import Link from "next/link";

import type { Category } from "@/features/catalog/types";

// Icons are a UI choice, so they're matched by slug here rather than sent by the API.
const categoryIcons: Record<string, LucideIcon> = {
  "engine-oil": Droplet,
  brakes: Disc3,
  "chain-sprockets": ChainIcon,
  filters: Funnel,
  batteries: BatteryCharging,
  tyres: CircleDot,
  "lights-electricals": Lightbulb,
  "clutch-cables": Cable,
  accessories: Smartphone,
  "riding-gear": HardHat,
};

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
      {categories.map((category) => {
        const Icon = categoryIcons[category.slug] ?? Package;
        return (
          <li key={category.id}>
            <Link
              href={`/products?category=${category.slug}`}
              className="flex h-full items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 text-sm font-semibold text-gray-900 shadow-sm transition-colors outline-none hover:border-navy-200 hover:bg-navy-50 focus-visible:ring-3 focus-visible:ring-ring/50 md:flex-col md:gap-2 md:p-4 md:text-center"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy-700 md:size-12">
                <Icon className="size-5 md:size-6" aria-hidden />
              </span>
              {category.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
