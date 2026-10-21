import type { StatusTone } from "@/components/ui/StatusBadge";
import type {
  DocumentKind,
  DocumentStatus,
  MyVehicle,
  SelectedVehicle,
  VehicleCatalog,
  VehicleRef,
  VehicleType,
} from "@/features/vehicles/types";
import { formatRegistration } from "@/lib/format";

/** Every vehicle type, in the order the selectors list them. */
export const vehicleTypes: { value: VehicleType; label: string; pluralLabel: string }[] = [
  { value: "bike", label: "Bike", pluralLabel: "bikes" },
  { value: "scooter", label: "Scooter", pluralLabel: "scooters" },
  { value: "car", label: "Car", pluralLabel: "cars" },
  { value: "commercial", label: "Commercial", pluralLabel: "commercial vehicles" },
];

/** ["bike", "scooter"] → "bikes and scooters" */
export function describeVehicleTypes(types: VehicleType[]): string {
  const labels = vehicleTypes.filter((t) => types.includes(t.value)).map((t) => t.pluralLabel);
  return labels.length > 1
    ? `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}`
    : (labels[0] ?? "");
}

/** "KTM Duke 200" */
export function getVehicleName(vehicle: Pick<VehicleRef, "brandName" | "modelName">): string {
  return `${vehicle.brandName} ${vehicle.modelName}`;
}

export function toSelectedVehicle({
  id,
  type,
  modelId,
  variantId,
  year,
  brandName,
  modelName,
  variantName,
}: MyVehicle): SelectedVehicle {
  return {
    type,
    modelId,
    variantId,
    year,
    brandName,
    modelName,
    variantName,
    myVehicleId: id,
  };
}

/** The `vehicle` query param on /products: "<variantId>.<year>", e.g. "ktm-duke-200-std.2023". */
export function toVehicleParam(vehicle: Pick<VehicleRef, "variantId" | "year">): string {
  return `${vehicle.variantId}.${vehicle.year}`;
}

/** The listing of parts that fit this vehicle. */
export function getVehiclePartsHref(vehicle: Pick<VehicleRef, "variantId" | "year">): string {
  return `/products?vehicle=${toVehicleParam(vehicle)}&fits=true`;
}

/** Reads a `vehicle` query param back into a vehicle; null when it doesn't match the vehicle master. */
export function parseVehicleParam(param: string, catalog: VehicleCatalog): VehicleRef | null {
  const separator = param.lastIndexOf(".");
  const variantId = param.slice(0, separator);
  const year = Number(param.slice(separator + 1));

  const model = catalog.models.find((m) => m.variants.some((v) => v.id === variantId));
  const variant = model?.variants.find((v) => v.id === variantId);
  const brand = catalog.brands.find((b) => b.id === model?.brandId);
  if (!model || !variant || !brand || !model.years.includes(year)) return null;

  return {
    type: model.type,
    modelId: model.id,
    variantId,
    year,
    brandName: brand.name,
    modelName: model.name,
    variantName: variant.name,
  };
}

/** True when both refer to the same exact vehicle. */
export function isSameVehicle(
  a: Pick<VehicleRef, "variantId" | "year">,
  b: Pick<VehicleRef, "variantId" | "year">,
): boolean {
  return a.variantId === b.variantId && a.year === b.year;
}

/** "KA 03 MX 4521", or a note when the plate hasn't been added. */
export function formatPlate(registrationNumber: string | null): string {
  return registrationNumber ? formatRegistration(registrationNumber) : "No number plate yet";
}

export const documentLabels: Record<DocumentKind, string> = {
  insurance: "Insurance",
  puc: "PUC",
  rc: "RC",
};

export const documentStatusLabels: Record<DocumentStatus, string> = {
  ok: "Valid",
  "due-soon": "Renew soon",
  overdue: "Expired",
  missing: "Not added",
};

export const documentStatusTones: Record<DocumentStatus, StatusTone> = {
  ok: "success",
  "due-soon": "warning",
  overdue: "danger",
  missing: "neutral",
};
