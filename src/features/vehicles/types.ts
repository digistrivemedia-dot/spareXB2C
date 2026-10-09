export type VehicleType = "bike" | "scooter";

export type VehicleBrand = {
  id: string;
  name: string;
};

export type VehicleVariant = {
  id: string;
  name: string;
};

export type VehicleModel = {
  id: string;
  brandId: string;
  name: string;
  type: VehicleType;
  variants: VehicleVariant[];
  /** Model years on sale, newest first. */
  years: number[];
};

/** The vehicle master behind every Type → Brand → Model → Variant → Year selector. */
export type VehicleCatalog = {
  brands: VehicleBrand[];
  models: VehicleModel[];
};

/** One exact vehicle, with display names so it can be shown without another lookup. */
export type VehicleRef = {
  modelId: string;
  variantId: string;
  year: number;
  brandName: string;
  modelName: string;
  variantName: string;
};

/** A bike saved in the customer's garage. */
export type MyBike = VehicleRef & {
  id: string;
  type: VehicleType;
  registrationNumber: string;
  odometerKm: number;
  odometerUpdatedAt: string;
  imageUrl: string | null;
  isDefault: boolean;
};

/** The bike the storefront checks fitment against. `myBikeId` is set when it is one of the customer's saved bikes. */
export type SelectedBike = VehicleRef & {
  myBikeId: string | null;
};

/** What the customer enters when adding a bike to their garage. */
export type AddBikeInput = VehicleRef & {
  registrationNumber: string;
  odometerKm: number;
};
