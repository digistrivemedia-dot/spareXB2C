import type { GarageQuery } from "@/features/service/types";
import type { VehicleType } from "@/features/vehicles/types";
import { vehicleTypes } from "@/features/vehicles/utils";
import { getSearchParam, type SearchParams } from "@/lib/search-params";

/** The garage list's state as it lives in the URL, so it can be shared and the back button works. */
export type GarageFilters = {
  pin?: string;
  service?: string;
  vehicleType?: VehicleType;
  topRated: boolean;
  openOnSunday: boolean;
  sort: "distance" | "rating";
};

export function parseGarageFilters(params: SearchParams): GarageFilters {
  const get = (key: string) => getSearchParam(params, key)?.trim() || undefined;
  const pin = get("pin");
  return {
    pin: pin && /^[1-9]\d{5}$/.test(pin) ? pin : undefined,
    service: get("service"),
    vehicleType: vehicleTypes.find((t) => t.value === get("type"))?.value,
    topRated: get("rating") === "4",
    openOnSunday: get("sunday") === "true",
    sort: get("sort") === "rating" ? "rating" : "distance",
  };
}

export function garagesHref(filters: GarageFilters, changes: Partial<GarageFilters> = {}): string {
  const next = { ...filters, ...changes };
  const params = new URLSearchParams();
  const set = (key: string, value: string | undefined | false) => {
    if (value) params.set(key, value);
  };
  set("pin", next.pin);
  set("service", next.service);
  set("type", next.vehicleType);
  set("rating", next.topRated && "4");
  set("sunday", next.openOnSunday && "true");
  set("sort", next.sort === "rating" && "rating");
  const query = params.toString();
  return query ? `/services/garages?${query}` : "/services/garages";
}

export function toGarageQuery(
  filters: GarageFilters,
  fallbackPin: string | undefined,
): GarageQuery {
  return {
    pin: filters.pin ?? fallbackPin,
    serviceTypeId: filters.service,
    vehicleType: filters.vehicleType,
    minRating: filters.topRated ? 4 : undefined,
    openOnSunday: filters.openOnSunday,
    sort: filters.sort,
  };
}
