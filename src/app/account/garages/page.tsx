import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { FavouriteGarages } from "@/features/service/components/FavouriteGarages";

export const metadata: Metadata = { title: "Favourite garages" };

export default function FavouriteGaragesPage() {
  return (
    <div className="grid grid-cols-1 gap-6">
      <PageHeader
        title="Favourite garages"
        description="Garages you saved with the heart, ready to book."
      />
      <FavouriteGarages />
    </div>
  );
}
