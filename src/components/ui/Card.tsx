import { cn } from "@/lib/utils";

/** The standard white content card, as a <section>; label it with `aria-labelledby` or `aria-label`. */
export function Card({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      className={cn("rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-6", className)}
      {...props}
    />
  );
}
