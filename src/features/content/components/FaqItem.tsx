import { ChevronDown } from "lucide-react";

import type { Faq } from "@/features/content/types";

/** One question that opens to show its answer. Native <details>, so it works without JavaScript. */
export function FaqItem({ faq }: { faq: Faq }) {
  return (
    <details id={`faq-${faq.id}`} className="group border-b border-gray-200 last:border-b-0">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 font-medium text-gray-900 outline-none hover:text-navy-700 focus-visible:ring-3 focus-visible:ring-ring/50 [&::-webkit-details-marker]:hidden">
        {faq.question}
        <ChevronDown
          className="size-5 shrink-0 text-gray-500 transition-transform group-open:rotate-180"
          aria-hidden
        />
      </summary>
      <div className="grid gap-3 pb-4 text-sm text-gray-700 md:text-base">
        {faq.answer.split("\n\n").map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </details>
  );
}
