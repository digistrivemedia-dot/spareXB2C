import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";

type SectionProps = {
  /** Used for the heading id, so the section is labelled for screen readers. */
  id: string;
  title: string;
  /** Optional "View all" style link on the right of the heading. */
  link?: { href: string; label: string };
  children: React.ReactNode;
  className?: string;
};

/** A titled full-width page section inside the standard container. */
export function Section({ id, title, link, children, className }: SectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section aria-labelledby={headingId} className={cn("py-6 md:py-8", className)}>
      <Container>
        <SectionHeader id={headingId} title={title} link={link} />
        {children}
      </Container>
    </section>
  );
}
