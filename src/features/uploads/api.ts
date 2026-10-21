import { apiClient } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import { mockUploads } from "@/mocks/uploads";

const useMock = dataSource.uploads === "mock";

/** Stores a customer's photo and returns the URL to save with the vehicle, return or enquiry. */
export async function uploadPhoto(file: File): Promise<string> {
  if (useMock) return mockUploads.uploadPhoto(file);
  const body = new FormData();
  body.set("file", file);
  const { url } = await apiClient.post<{ url: string }>("/uploads", body);
  return url;
}
