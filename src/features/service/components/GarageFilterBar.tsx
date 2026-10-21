"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/SelectField";
import { type GarageFilters, garagesHref } from "@/features/service/filters";
import type { ServiceType } from "@/features/service/types";
import { vehicleTypes } from "@/features/vehicles/utils";
import { cn } from "@/lib/utils";

const ALL = "all";

type GarageFilterBarProps = {
  filters: GarageFilters;
  serviceTypes: ServiceType[];
  /** The PIN distances are measured from, shown in the box. */
  pin: string | undefined;
};

/** Area (PIN), service, vehicle type, sort, and quick toggles. Every choice updates the URL. */
export function GarageFilterBar({ filters, serviceTypes, pin }: GarageFilterBarProps) {
  const router = useRouter();
  const [pinInput, setPinInput] = useState(pin ?? "");
  const go = (changes: Partial<GarageFilters>) =>
    router.push(garagesHref(filters, changes), { scroll: false });
  const toggles = [
    { key: "topRated", label: "4★ & above", isOn: filters.topRated },
    { key: "openOnSunday", label: "Open on Sunday", isOn: filters.openOnSunday },
  ] as const;

  return (
    <div className="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <form
        className="flex flex-wrap items-end gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          if (/^[1-9]\d{5}$/.test(pinInput)) go({ pin: pinInput });
        }}
      >
        <div className="grid min-w-0 flex-1 basis-40 gap-2">
          <Label htmlFor="garage-pin">Garages near PIN code</Label>
          <Input
            id="garage-pin"
            inputMode="numeric"
            maxLength={6}
            autoComplete="postal-code"
            placeholder="560066"
            value={pinInput}
            onChange={(event) => setPinInput(event.target.value.replace(/\D/g, ""))}
          />
        </div>
        <Button type="submit" variant="secondary">
          Update
        </Button>
      </form>

      <div className="grid gap-3 sm:grid-cols-3">
        <SelectField
          id="garage-service"
          label="Service"
          placeholder="All services"
          value={filters.service ?? ALL}
          options={[
            { value: ALL, label: "All services" },
            ...serviceTypes.map((t) => ({ value: t.id, label: t.name })),
          ]}
          onChange={(value) => go({ service: value === ALL ? undefined : value })}
        />
        <SelectField
          id="garage-vehicle"
          label="Vehicle"
          placeholder="All vehicles"
          value={filters.vehicleType ?? ALL}
          options={[{ value: ALL, label: "All vehicles" }, ...vehicleTypes]}
          onChange={(value) =>
            go({ vehicleType: vehicleTypes.find((t) => t.value === value)?.value })
          }
        />
        <SelectField
          id="garage-sort"
          label="Sort by"
          placeholder="Nearest first"
          value={filters.sort}
          options={[
            { value: "distance", label: "Nearest first" },
            { value: "rating", label: "Top rated" },
          ]}
          onChange={(value) => go({ sort: value === "rating" ? "rating" : "distance" })}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {toggles.map((toggle) => (
          <button
            key={toggle.key}
            type="button"
            aria-pressed={toggle.isOn}
            onClick={() => go({ [toggle.key]: !toggle.isOn })}
            className={cn(
              "inline-flex h-11 items-center rounded-full border px-4 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:h-9",
              toggle.isOn
                ? "border-navy-800 bg-navy-800 text-white"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
            )}
          >
            {toggle.label}
          </button>
        ))}
      </div>
    </div>
  );
}
