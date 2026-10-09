import { ChevronRight } from "lucide-react";
import Link from "next/link";

type SectionHeaderProps = {
  id: string;
  title: string;
  /** Optional "View all" style link on the right. */
  link?: { href: string; label: string };
};

/** A section title (h2) with an optional link; `id` labels the section for screen readers. */
export function SectionHeader({ id, title, link }: SectionHeaderProps) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <h2 id={id} className="text-lg font-semibold text-gray-900 md:text-xl">
        {title}
      </h2>
      {link && (
        <Link
          href={link.href}
          className="inline-flex shrink-0 items-center gap-0.5 text-sm font-semibold text-navy-700 hover:underline"
        >
          {link.label}
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      )}
    </div>
  );
}
