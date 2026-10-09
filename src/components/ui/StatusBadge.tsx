import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs leading-none font-semibold whitespace-nowrap",
  {
    variants: {
      tone: {
        success: "bg-success-50 text-success-700",
        warning: "bg-warning-50 text-warning-700",
        danger: "bg-danger-50 text-danger-700",
        info: "bg-info-50 text-info-700",
        neutral: "bg-gray-100 text-gray-700",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export type StatusTone = NonNullable<VariantProps<typeof statusBadgeVariants>["tone"]>;

type StatusBadgeProps = {
  tone: StatusTone;
  children: React.ReactNode;
  className?: string;
};

/** A coloured status pill. Status colours are only for status: ok, due soon, overdue, info. */
export function StatusBadge({ tone, children, className }: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ tone }), className)}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {children}
    </span>
  );
}
