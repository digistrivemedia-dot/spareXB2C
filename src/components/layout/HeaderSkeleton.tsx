import { cn } from "@/lib/utils";

/** Placeholder for a header control while its data loads, sized like the real thing. */
export function HeaderSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("h-11 animate-pulse rounded-full bg-navy-700", className)} aria-hidden />
  );
}
