"use client";

import { toast } from "sonner";

import { HeartToggle } from "@/components/ui/HeartToggle";
import { useFavouriteGaragesStore } from "@/features/service/favourites-store";

type FavouriteGarageButtonProps = {
  garageId: string;
  garageName: string;
  className?: string;
};

export function FavouriteGarageButton({
  garageId,
  garageName,
  className,
}: FavouriteGarageButtonProps) {
  const isFavourite = useFavouriteGaragesStore((state) => state.ids.includes(garageId));
  const toggle = useFavouriteGaragesStore((state) => state.toggle);

  function handleClick() {
    toggle(garageId);
    toast.success(isFavourite ? "Removed from favourite garages" : "Added to favourite garages", {
      description: garageName,
    });
  }

  return (
    <HeartToggle
      isOn={isFavourite}
      onClick={handleClick}
      aria-label={`Add ${garageName} to favourite garages`}
      className={className}
    />
  );
}
