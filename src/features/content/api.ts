import type { FaqTopic, Policy, PolicyLink } from "@/features/content/types";
import { apiClient, orNull } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import { mockContent } from "@/mocks/content";

const useMock = dataSource.content === "mock";

/** Help page questions, grouped by topic, in the order set in the admin panel. */
export function getFaqTopics(): Promise<FaqTopic[]> {
  return useMock ? mockContent.getFaqTopics() : apiClient.get("/content/faqs");
}

export function getPolicies(): Promise<PolicyLink[]> {
  return useMock ? mockContent.getPolicies() : apiClient.get("/content/policies");
}

export function getPolicy(slug: string): Promise<Policy | null> {
  return useMock ? mockContent.getPolicy(slug) : orNull(apiClient.get(`/content/policies/${slug}`));
}
