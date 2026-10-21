import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { SavedItems } from "@/features/wishlist/components/SavedItems";

export const metadata: Metadata = { title: "Saved parts" };

export default function SavedPage() {
  return (
    <div className="grid grid-cols-1 gap-6">
      <PageHeader
        title="Saved parts"
        description="Parts you saved with the heart, ready when you are."
      />
      <SavedItems />
    </div>
  );
}
