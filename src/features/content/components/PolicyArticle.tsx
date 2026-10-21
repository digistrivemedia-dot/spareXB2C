import { Card } from "@/components/ui/Card";
import type { Policy } from "@/features/content/types";
import { formatDate } from "@/lib/format";

/** A policy's sections, with an "On this page" list beside them on wide screens. */
export function PolicyArticle({ policy }: { policy: Policy }) {
  return (
    <div className="grid gap-6 lg:grid-cols-4 lg:items-start">
      <nav aria-labelledby="policy-contents" className="hidden lg:sticky lg:top-24 lg:block">
        <h2 id="policy-contents" className="text-sm font-semibold text-gray-900">
          On this page
        </h2>
        <ul className="mt-2 grid border-l border-gray-200">
          {policy.sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="-ml-px flex min-h-9 items-center border-l-2 border-transparent pl-3 text-sm text-gray-600 hover:border-navy-700 hover:text-navy-700"
              >
                {section.heading}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <Card aria-label={policy.title} className="grid gap-8 lg:col-span-3">
        <div className="grid gap-2">
          <p className="text-base text-gray-700 md:text-lg">{policy.summary}</p>
          <p className="text-sm text-gray-500">Last updated {formatDate(policy.updatedAt)}</p>
        </div>
        {policy.sections.map((section) => (
          <section key={section.id} id={section.id} className="grid scroll-mt-28 gap-3">
            <h2 className="text-lg font-semibold text-gray-900 md:text-xl">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-relaxed text-gray-700 md:text-base">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </Card>
    </div>
  );
}
