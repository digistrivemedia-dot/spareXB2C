import { CircleHelp } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { FaqItem } from "@/features/content/components/FaqItem";
import { SupportCard } from "@/features/content/components/SupportCard";
import type { FaqTopic, PolicyLink } from "@/features/content/types";

type HelpCentreProps = {
  topics: FaqTopic[];
  policies: PolicyLink[];
};

/** Questions grouped by topic, with ways to reach us beside them (below them on phones). */
export function HelpCentre({ topics, policies }: HelpCentreProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
      <div className="grid gap-6 lg:col-span-2">
        {topics.length > 0 ? (
          <>
            <nav aria-label="Help topics">
              <ul className="flex flex-wrap gap-2">
                {topics.map((topic) => (
                  <li key={topic.id}>
                    <a
                      href={`#topic-${topic.id}`}
                      className="inline-flex h-11 items-center rounded-full border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 outline-none hover:bg-gray-50 focus-visible:ring-3 focus-visible:ring-ring/50 md:h-9"
                    >
                      {topic.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            {topics.map((topic) => (
              <Card
                key={topic.id}
                id={`topic-${topic.id}`}
                aria-labelledby={`topic-${topic.id}-heading`}
                className="scroll-mt-28 py-2 md:py-3"
              >
                <h2
                  id={`topic-${topic.id}-heading`}
                  className="pt-2 text-lg font-semibold text-gray-900 md:text-xl"
                >
                  {topic.title}
                </h2>
                {topic.faqs.map((faq) => (
                  <FaqItem key={faq.id} faq={faq} />
                ))}
              </Card>
            ))}
          </>
        ) : (
          <EmptyState
            icon={CircleHelp}
            title="Help articles are on their way"
            description="Our team is writing answers to common questions. Meanwhile, call or email us."
          />
        )}
      </div>
      <div className="lg:sticky lg:top-24">
        <SupportCard policies={policies} />
      </div>
    </div>
  );
}
