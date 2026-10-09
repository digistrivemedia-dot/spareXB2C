import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Heading level: "h1" when it is the whole page, "h3" inside a titled section. */
  titleAs?: "h1" | "h2" | "h3";
  /** Action buttons. */
  children?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  titleAs: Title = "h2",
  children,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center",
        className,
      )}
    >
      <span className="flex size-14 items-center justify-center rounded-full bg-navy-50 text-navy-700">
        <Icon className="size-7" aria-hidden />
      </span>
      <Title className="mt-4 text-lg font-semibold text-gray-900 md:text-xl">{title}</Title>
      <p className="mt-2 text-sm text-gray-600 md:text-base">{description}</p>
      {children && <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div>}
    </div>
  );
}
