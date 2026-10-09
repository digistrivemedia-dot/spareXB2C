"use client";

import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAddToCart } from "@/features/cart/useAddToCart";
import type { ProductSummary } from "@/features/catalog/types";

type AddToCartButtonProps = {
  product: ProductSummary;
  className?: string;
};

export function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const addToCart = useAddToCart();

  if (product.stockQuantity === 0) {
    return (
      <Button variant="secondary" disabled className={className}>
        Out of stock
      </Button>
    );
  }

  return (
    <Button onClick={() => addToCart(product)} className={className}>
      <ShoppingCart aria-hidden />
      Add to cart
    </Button>
  );
}
