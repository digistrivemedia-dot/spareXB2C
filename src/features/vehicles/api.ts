import type { AddBikeInput, MyBike, VehicleCatalog } from "@/features/vehicles/types";
import { apiClient, orNull } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import { mockVehicles } from "@/mocks/vehicles";

const useMock = dataSource.vehicles === "mock";

export function getVehicleCatalog(): Promise<VehicleCatalog> {
  return useMock ? mockVehicles.getVehicleCatalog() : apiClient.get("/vehicles/catalog");
}

export function getMyBikes(): Promise<MyBike[]> {
  return useMock ? mockVehicles.getMyBikes() : apiClient.get("/me/bikes");
}

export function getMyBike(id: string): Promise<MyBike | null> {
  return useMock ? mockVehicles.getMyBike(id) : orNull(apiClient.get(`/me/bikes/${id}`));
}

export function updateOdometer(id: string, odometerKm: number): Promise<MyBike | null> {
  return useMock
    ? mockVehicles.updateOdometer(id, odometerKm)
    : orNull(apiClient.patch(`/me/bikes/${id}`, { odometerKm }));
}

export function addMyBike(input: AddBikeInput): Promise<MyBike> {
  return useMock ? mockVehicles.addMyBike(input) : apiClient.post("/me/bikes", input);
}
