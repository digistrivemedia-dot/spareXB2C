import type {
  AddVehicleInput,
  MyVehicle,
  UpdateVehicleInput,
  VehicleCatalog,
} from "@/features/vehicles/types";
import { apiClient, orNull } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import { mockVehicles } from "@/mocks/vehicles";

const useMock = dataSource.vehicles === "mock";

export function getVehicleCatalog(): Promise<VehicleCatalog> {
  return useMock ? mockVehicles.getVehicleCatalog() : apiClient.get("/vehicles/catalog");
}

/** The customer's vehicles, the default first. */
export function getMyVehicles(): Promise<MyVehicle[]> {
  return useMock ? mockVehicles.getMyVehicles() : apiClient.get("/me/vehicles");
}

export function getMyVehicle(id: string): Promise<MyVehicle | null> {
  return useMock ? mockVehicles.getMyVehicle(id) : orNull(apiClient.get(`/me/vehicles/${id}`));
}

export function updateOdometer(id: string, odometerKm: number): Promise<MyVehicle | null> {
  return useMock
    ? mockVehicles.updateOdometer(id, odometerKm)
    : orNull(apiClient.patch(`/me/vehicles/${id}`, { odometerKm }));
}

export function addMyVehicle(input: AddVehicleInput): Promise<MyVehicle> {
  return useMock ? mockVehicles.addMyVehicle(input) : apiClient.post("/me/vehicles", input);
}

/** Registration, photos and documents. The server works out each document's status. */
export function updateMyVehicle(id: string, input: UpdateVehicleInput): Promise<MyVehicle | null> {
  return useMock
    ? mockVehicles.updateMyVehicle(id, input)
    : orNull(apiClient.put(`/me/vehicles/${id}`, input));
}

export function setDefaultVehicle(id: string): Promise<void> {
  return useMock
    ? mockVehicles.setDefaultVehicle(id)
    : apiClient.post(`/me/vehicles/${id}/default`);
}

/** Removing the default makes the next vehicle the default. */
export function removeMyVehicle(id: string): Promise<void> {
  return useMock ? mockVehicles.removeMyVehicle(id) : apiClient.delete(`/me/vehicles/${id}`);
}
