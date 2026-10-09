import type { MyBike, SelectedBike, VehicleCatalog, VehicleRef } from "@/features/vehicles/types";

/** "KTM Duke 200" */
export function getBikeName(bike: Pick<VehicleRef, "brandName" | "modelName">): string {
  return `${bike.brandName} ${bike.modelName}`;
}

export function toSelectedBike({
  id,
  modelId,
  variantId,
  year,
  brandName,
  modelName,
  variantName,
}: MyBike): SelectedBike {
  return {
    modelId,
    variantId,
    year,
    brandName,
    modelName,
    variantName,
    myBikeId: id,
  };
}

/** The `bike` query param on /products: "<variantId>.<year>", e.g. "ktm-duke-200-std.2023". */
export function toBikeParam(bike: Pick<VehicleRef, "variantId" | "year">): string {
  return `${bike.variantId}.${bike.year}`;
}

/** The listing of parts that fit this bike. */
export function getBikePartsHref(bike: Pick<VehicleRef, "variantId" | "year">): string {
  return `/products?bike=${toBikeParam(bike)}&fits=true`;
}

/** Reads a `bike` query param back into a vehicle; null when it doesn't match the vehicle master. */
export function parseBikeParam(param: string, catalog: VehicleCatalog): VehicleRef | null {
  const separator = param.lastIndexOf(".");
  const variantId = param.slice(0, separator);
  const year = Number(param.slice(separator + 1));

  const model = catalog.models.find((m) => m.variants.some((v) => v.id === variantId));
  const variant = model?.variants.find((v) => v.id === variantId);
  const brand = catalog.brands.find((b) => b.id === model?.brandId);
  if (!model || !variant || !brand || !model.years.includes(year)) return null;

  return {
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
