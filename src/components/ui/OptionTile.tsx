import { cn } from "@/lib/utils";

type OptionTileProps = React.ComponentProps<"button"> & {
  isSelected?: boolean;
};

/** A large tappable choice in a step-by-step flow. */
export function OptionTile({ isSelected = false, className, ...props }: OptionTileProps) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      className={cn(
        "flex min-h-14 w-full flex-col items-start justify-center gap-0.5 rounded-xl border bg-white p-4 text-left text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        isSelected
          ? "border-navy-700 bg-navy-50"
          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
        className,
      )}
      {...props}
    />
  );
}
