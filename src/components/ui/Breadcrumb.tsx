import { ChevronRight } from "lucide-react";
import Link from "next/link";

type Crumb = {
  label: string;
  /** Omit for the current page. */
  href?: string;
};

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-600">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-1">
            {index > 0 && <ChevronRight className="size-4 text-gray-400" aria-hidden />}
            {item.href ? (
              <Link href={item.href} className="hover:text-navy-700 hover:underline">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="line-clamp-1 font-medium text-gray-900">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
