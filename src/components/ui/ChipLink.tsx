import Link from "next/link";

import { cn } from "@/lib/utils";

type ChipLinkProps = React.ComponentProps<typeof Link> & {
  isActive: boolean;
};

/** A filter chip that is a link, so the choice lives in the URL. */
export function ChipLink({ isActive, className, ...props }: ChipLinkProps) {
  return (
    <Link
      aria-current={isActive ? "true" : undefined}
      scroll={false}
      className={cn(
        "inline-flex h-11 shrink-0 items-center rounded-full border px-4 text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:h-9",
        isActive
          ? "border-navy-800 bg-navy-800 text-white"
          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
        className,
      )}
      {...props}
    />
  );
}
