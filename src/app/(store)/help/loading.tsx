import { Container } from "@/components/layout/Container";
import { HelpCentreSkeleton } from "@/features/content/components/HelpCentreSkeleton";

export default function HelpLoading() {
  return (
    <Container className="py-6 lg:py-8">
      <HelpCentreSkeleton />
    </Container>
  );
}
