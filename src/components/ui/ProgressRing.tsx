import { cn } from "@/lib/utils";

type ProgressRingProps = {
  /** 0–100. */
  percent: number;
  label: string;
  /** Stroke colours, e.g. "stroke-white/15" and "stroke-orange-500". */
  trackClassName?: string;
  barClassName?: string;
  className?: string;
  /** Shown in the middle of the ring. */
  children?: React.ReactNode;
};

/** A circular progress meter with content in its middle. Size it with `className` (e.g. "size-36"). */
export function ProgressRing({
  percent,
  label,
  trackClassName = "stroke-gray-200",
  barClassName = "stroke-navy-600",
  className,
  children,
}: ProgressRingProps) {
  const value = Math.min(100, Math.max(0, percent));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("relative grid shrink-0 place-items-center", className)}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full -rotate-90" aria-hidden>
        <circle cx="50" cy="50" r="44" fill="none" strokeWidth="8" className={trackClassName} />
        {/* pathLength="100" makes the dash offset a plain percentage. */}
        <circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray="100"
          strokeDashoffset={100 - value}
          className={barClassName}
        />
      </svg>
      <div className="relative text-center">{children}</div>
    </div>
  );
}
