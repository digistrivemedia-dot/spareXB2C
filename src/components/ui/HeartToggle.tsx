import { Heart } from "lucide-react";

import { cn } from "@/lib/utils";

type HeartToggleProps = Omit<React.ComponentProps<"button">, "children"> & {
  isOn: boolean;
};

/** The round heart for saving something (a part, a garage). Pressed = saved. */
export function HeartToggle({ isOn, className, ...props }: HeartToggleProps) {
  return (
    <button
      type="button"
      aria-pressed={isOn}
      className={cn(
        "flex size-11 items-center justify-center rounded-full bg-white/90 text-gray-500 shadow-sm transition-colors outline-none hover:text-danger-600 focus-visible:ring-3 focus-visible:ring-ring/50 aria-pressed:text-danger-600",
        className,
      )}
      {...props}
    >
      <Heart className={cn("size-5", isOn && "fill-current")} aria-hidden />
    </button>
  );
}
