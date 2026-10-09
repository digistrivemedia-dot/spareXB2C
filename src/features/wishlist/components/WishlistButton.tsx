"use client";

import { Heart } from "lucide-react";
import { toast } from "sonner";

import { useWishlistStore } from "@/features/wishlist/store";
import { cn } from "@/lib/utils";

type WishlistButtonProps = {
  productId: string;
  productName: string;
  className?: string;
};

export function WishlistButton({ productId, productName, className }: WishlistButtonProps) {
  const isSaved = useWishlistStore((state) => state.productIds.includes(productId));
  const toggle = useWishlistStore((state) => state.toggle);

  function handleClick() {
    toggle(productId);
    toast.success(isSaved ? "Removed from your wishlist" : "Saved to your wishlist", {
      description: productName,
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isSaved}
      aria-label={`Save ${productName} to wishlist`}
      className={cn(
        "flex size-11 items-center justify-center rounded-full bg-white/90 text-gray-500 shadow-sm transition-colors outline-none hover:text-danger-600 focus-visible:ring-3 focus-visible:ring-ring/50 aria-pressed:text-danger-600",
        className,
      )}
    >
      <Heart className={cn("size-5", isSaved && "fill-current")} aria-hidden />
    </button>
  );
}
