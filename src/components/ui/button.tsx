import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

// Mobile sizes keep a 44px minimum tap target; desktop can be a little tighter.
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-transparent text-sm font-semibold whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-orange-700 text-white hover:bg-orange-800",
        secondary: "border-gray-300 bg-white text-gray-900 hover:bg-gray-50",
        ghost: "text-navy-700 hover:bg-navy-50",
        destructive: "border-danger-700 bg-white text-danger-700 hover:bg-danger-50",
        link: "text-navy-700 underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-11 px-3 md:h-9",
        default: "h-11 px-4 md:h-10",
        lg: "h-12 px-6 text-base",
        icon: "size-11 md:size-10",
      },
    },
    // A link reads as text, so it drops the button height and padding whatever the size.
    compoundVariants: [{ variant: "link", className: "h-auto px-0 md:h-auto" }],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
