"use client";

import { toast } from "sonner";

import { HeartToggle } from "@/components/ui/HeartToggle";
import { useWishlistStore } from "@/features/wishlist/store";

type WishlistButtonProps = {
  productId: string;
  productName: string;
  className?: string;
};

export function WishlistButton({ productId, productName, className }: WishlistButtonProps) {
  const isSaved = useWishlistStore((state) => state.ids.includes(productId));
  const toggle = useWishlistStore((state) => state.toggle);

  function handleClick() {
    toggle(productId);
    toast.success(isSaved ? "Removed from saved parts" : "Saved to your parts", {
      description: productName,
    });
  }

  return (
    <HeartToggle
      isOn={isSaved}
      onClick={handleClick}
      aria-label={`Save ${productName}`}
      className={className}
    />
  );
}
