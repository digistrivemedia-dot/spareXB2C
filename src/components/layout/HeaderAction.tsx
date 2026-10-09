import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const headerActionVariants = cva(
  "inline-flex h-11 shrink-0 items-center gap-2 text-sm font-medium text-white transition-colors outline-none focus-visible:ring-3 focus-visible:ring-white/60",
  {
    variants: {
      variant: {
        plain: "rounded-lg px-2.5 hover:bg-navy-700",
        pill: "rounded-full bg-navy-700 px-3 hover:bg-navy-600",
      },
    },
    defaultVariants: { variant: "plain" },
  },
);

type HeaderActionProps = React.ComponentProps<"button"> &
  VariantProps<typeof headerActionVariants> & {
    asChild?: boolean;
  };

/** A white-on-navy control for the header (location, bike, cart, account). Renders a link with `asChild`. */
export function HeaderAction({ asChild = false, variant, className, ...props }: HeaderActionProps) {
  const Comp = asChild ? Slot.Root : "button";
  return <Comp className={cn(headerActionVariants({ variant }), className)} {...props} />;
}
