"use client";

import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAddToCart } from "@/features/cart/useAddToCart";
import type { ProductSummary } from "@/features/catalog/types";

type AddToCartButtonProps = {
  product: ProductSummary;
  /** "icon" is a small cart button for compact cards. */
  size?: "default" | "icon";
  className?: string;
};

export function AddToCartButton({ product, size = "default", className }: AddToCartButtonProps) {
  const addToCart = useAddToCart();

  if (size === "icon") {
    return (
      <Button
        size="icon"
        variant="secondary"
        onClick={() => addToCart(product)}
        disabled={product.stockQuantity === 0}
        aria-label={
          product.stockQuantity === 0
            ? `${product.name} is out of stock`
            : `Add ${product.name} to cart`
        }
        className={className}
      >
        <ShoppingCart aria-hidden />
      </Button>
    );
  }

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
