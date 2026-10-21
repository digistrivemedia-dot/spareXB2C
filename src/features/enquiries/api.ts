import type { Enquiry, EnquiryInput } from "@/features/enquiries/types";
import { apiClient } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import { mockEnquiries } from "@/mocks/enquiries";

const useMock = dataSource.enquiries === "mock";

/** The customer's enquiries, newest first. */
export function getEnquiries(): Promise<Enquiry[]> {
  return useMock ? mockEnquiries.getEnquiries() : apiClient.get("/me/enquiries");
}

export function sendEnquiry(input: EnquiryInput): Promise<Enquiry> {
  return useMock ? mockEnquiries.sendEnquiry(input) : apiClient.post("/me/enquiries", input);
}
