import { X } from "lucide-react";
import Link from "next/link";

type RemovableChipProps = {
  label: string;
  /** Where to go without this filter. */
  removeHref: string;
};

/** An applied filter shown as a chip; following the link removes it. */
export function RemovableChip({ label, removeHref }: RemovableChipProps) {
  return (
    <Link
      href={removeHref}
      scroll={false}
      aria-label={`Remove filter: ${label}`}
      className="inline-flex h-11 items-center gap-1.5 rounded-full border border-navy-200 bg-navy-50 pr-3 pl-4 text-sm font-medium text-navy-800 outline-none hover:bg-navy-100 focus-visible:ring-3 focus-visible:ring-ring/50 md:h-9"
    >
      {label}
      <X className="size-4" aria-hidden />
    </Link>
  );
}
