import type { Photo } from "@/lib/types";

export type VehicleType = "bike" | "scooter" | "car" | "commercial";

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
  type: VehicleType;
  modelId: string;
  variantId: string;
  year: number;
  brandName: string;
  modelName: string;
  variantName: string;
};

export type DocumentKind = "insurance" | "puc" | "rc";

/** Worked out by the server from the expiry date. */
export type DocumentStatus = "ok" | "due-soon" | "overdue" | "missing";

/** One of the vehicle's papers. Everything but the kind is optional until the customer adds it. */
export type VehicleDocument = {
  kind: DocumentKind;
  /** Policy or certificate number. */
  number: string | null;
  /** The insurance company; insurance only. */
  provider: string | null;
  expiresOn: string | null;
  status: DocumentStatus;
  /** A photo of the paper. */
  photo: Photo | null;
};

/** A vehicle saved in the customer's garage. */
export type MyVehicle = VehicleRef & {
  id: string;
  /** Optional: a new vehicle may not have its plate yet. */
  registrationNumber: string | null;
  odometerKm: number;
  odometerUpdatedAt: string;
  /** The first one is the main photo. */
  photos: Photo[];
  /** Always insurance, PUC and RC, in that order. */
  documents: VehicleDocument[];
  isDefault: boolean;
};

/** The vehicle the storefront checks fitment against. `myVehicleId` is set when it is one of the customer's saved vehicles. */
export type SelectedVehicle = VehicleRef & {
  myVehicleId: string | null;
};

/** What the customer enters when adding a vehicle to their garage. */
export type AddVehicleInput = VehicleRef & {
  registrationNumber: string | null;
  odometerKm: number;
};

/** A document as the customer edits it; the server works out its status. */
export type VehicleDocumentInput = Omit<VehicleDocument, "status">;

/** What the vehicle edit page sends. Model and year can't change: that's a different vehicle. */
export type UpdateVehicleInput = {
  registrationNumber: string | null;
  photos: Photo[];
  documents: VehicleDocumentInput[];
};
